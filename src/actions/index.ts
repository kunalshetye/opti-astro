import { defineAction } from "astro:actions";
import { z } from "astro:schema";

const odpBaseUrl = import.meta.env.OPTIMIZELY_DATA_PLATFORM_ENDPOINT;
const odpPrivateKey = import.meta.env.OPTIMIZELY_DATA_PLATFORM_PRIVATE_KEY;

// Construct the ODP event endpoint from the environment variable.
const ODP_EVENT_ENDPOINT = odpBaseUrl
    ? `${odpBaseUrl.replace(/\/$/, "")}/v3/events`
    : "";

const odpPublicKey = odpPrivateKey ? odpPrivateKey.split('.')[0] : null;

/**
 * Converts FormData to a plain object with lowercase keys.
 * @param formData The FormData object.
 * @returns A plain object with lowercase keys.
 */
function formDataToObjectWithLowercaseKeys(formData: FormData): { [key: string]: FormDataEntryValue } {
    const obj: { [key: string]: FormDataEntryValue } = {};
    for (const [key, value] of formData.entries()) {
        obj[key.toLowerCase()] = value;
    }
    return obj;
}

/**
 * Transforms FormData into the specific event JSON structure required by the ODP Events API.
 * @param formData The FormData object from the form submission.
 * @param vuid The VUID from the user's cookie.
 * @returns A JSON object for the ODP event.
 */
function transformFormDataForOdpEvent(formData: FormData, vuid?: string | null): object {
    const allFields = formDataToObjectWithLowercaseKeys(formData);
    // Destructure known fields and gather the rest. 'formtitle' is expected from a hidden input.
    const { formtitle, email, ...otherData } = allFields;

    const identifiers: { vuid?: string; email?: FormDataEntryValue } = {};
    if (vuid) {
        identifiers.vuid = vuid;
    }
    if (email) {
        identifiers.email = email;
    }

    return {
        type: "web_form",
        action: "submission",
        data: {
            form_name: formtitle || "N/A", // Use formtitle from form, with a fallback.
            campaign: "Form Submission: " + (formtitle || "N/A"),
            ...otherData,
            ...(email && { email }), // Also include email in the data payload if it exists
        },
        identifiers,
    };
}

export async function submitFormData(method: string, submitUrl: string, body?: any) {
    const url = new URL(submitUrl);
    const headers: HeadersInit = {};
    let requestBody: BodyInit | null = null;
    const isOdpEvent = ODP_EVENT_ENDPOINT && submitUrl === ODP_EVENT_ENDPOINT;

    if (isOdpEvent) {
        headers['Content-Type'] = 'application/json';
        if (odpPublicKey) {
            headers['x-api-key'] = odpPublicKey;
        }
        // ODP Events API uses Basic Auth with the private key as the username.
        if (odpPrivateKey) {
            const basicAuth = Buffer.from(`${odpPrivateKey}:`).toString('base64');
            headers['Authorization'] = `Basic ${basicAuth}`;
        }
        requestBody = JSON.stringify(body);
    } else if (body) {
        // Existing logic for non-ODP submissions
        requestBody = body instanceof FormData ? body : JSON.stringify(body);
        if (!(body instanceof FormData)) headers["Content-Type"] = "application/json";
    }

    try {
        const response = await fetch(url.href, {
            method: method,
            headers,
            body: requestBody,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("error", error);
        throw error;
    }
}

export const server = {
    submitForm: defineAction({
        accept: "form",
        // TODO: server-side validation
        // input: z.object({
        //   email: z
        //     .string({ message: "This field has to be filled." })
        //     .email("This is not a valid email."),
        // }),

        handler: async (formSubmission, { cookies }) => {
            const webhookUrl = formSubmission.get('formSubmitUrl') as string;

            if (!webhookUrl) {
                throw new Error('No submit URL provided');
            }

            formSubmission.delete('formSubmitUrl');

            const normalizedWebhookUrl = webhookUrl.replace(/\/$/, "");
            const normalizedOdpBaseUrl = odpBaseUrl ? odpBaseUrl.replace(/\/$/, "") : "";

            const isOdpSubmission = (ODP_EVENT_ENDPOINT && normalizedWebhookUrl === ODP_EVENT_ENDPOINT) || (normalizedOdpBaseUrl && normalizedWebhookUrl === normalizedOdpBaseUrl);

            let payload;
            let finalSubmitUrl = webhookUrl;

            if (isOdpSubmission) {
                if (!ODP_EVENT_ENDPOINT) {
                    throw new Error("ODP submission intended, but ODP endpoint is not configured.");
                }
                finalSubmitUrl = ODP_EVENT_ENDPOINT; // Always submit to the full events endpoint
                const vuidCookie = cookies.get('vuid')?.value;
                const vuid = vuidCookie ? vuidCookie.split('|')[0] : null;
                payload = transformFormDataForOdpEvent(formSubmission, vuid);
            } else {
                payload = formDataToObjectWithLowercaseKeys(formSubmission);
            }

            const responseData = await submitFormData("POST", finalSubmitUrl, payload);

            if (!responseData) {
                return {
                    formSubmitErrors: null,
                    message: "Oops! Something went wrong. Please try again.",
                };
            }

            if (responseData.error) {
                return {
                    formSubmitErrors: responseData.error,
                    message: "Failed to Register.",
                };
            }

            return {
                message: "Form submitted, thank you.",
                data: responseData,
                formSubmitErrors: null,
            };
        },
    }),
};
