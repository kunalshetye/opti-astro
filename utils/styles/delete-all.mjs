import { createClient } from '@remkoj/optimizely-cms-api';
import readline from 'readline';

const clientId = process.env.OPTIMIZELY_CLIENT_ID;
const clientSecret = process.env.OPTIMIZELY_CLIENT_SECRET;
const cmsUrl = process.env.OPTIMIZELY_CMS_URL;

// Create an instance of the client
const config = {
    base: new URL(cmsUrl),
    clientId: clientId,
    clientSecret: clientSecret,
};
const client = createClient(config);

// Parse command line arguments
const args = process.argv.slice(2);
// DRY RUN IS THE DEFAULT - must explicitly use --force to actually delete
const forceDelete = args.includes('--force') || args.includes('-f');
const dryRun = !forceDelete; // Dry run unless --force is specified
const skipConfirm = args.includes('--yes') || args.includes('-y');

/**
 * Ask for user confirmation
 */
function askConfirmation(question) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
        });
    });
}

/**
 * Fetch all display templates from CMS
 */
async function getAllDisplayTemplates() {
    try {
        console.log('Fetching all display templates from CMS...');
        const response = await client.displayTemplates.displayTemplatesList();
        return response?.items || [];
    } catch (error) {
        console.error('Error fetching display templates:', error.message);
        return [];
    }
}

/**
 * Delete a single display template
 */
async function deleteDisplayTemplate(styleKey) {
    try {
        await client.displayTemplates.displayTemplatesDelete(styleKey);
        return true;
    } catch (error) {
        console.error(`Error deleting ${styleKey}:`, error.message);
        return false;
    }
}

// Main execution
(async () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  Optimizely CMS - Delete All Display Templates');
    console.log('═══════════════════════════════════════════════════════\n');

    if (dryRun) {
        console.log('🔍 DRY RUN MODE - No changes will be made\n');
    }

    // Fetch all templates
    const templates = await getAllDisplayTemplates();

    if (templates.length === 0) {
        console.log('✅ No display templates found in CMS');
        return;
    }

    console.log(`Found ${templates.length} display template(s):\n`);

    // List all templates
    templates.forEach((template, index) => {
        const key = template.key;
        const name = template.displayName || 'Unnamed';
        const type = template.contentType || template.nodeType || 'undefined';
        console.log(`  ${index + 1}. ${key} - "${name}" (type: ${type})`);
    });

    console.log('');

    // Confirmation
    if (!dryRun && !skipConfirm) {
        console.log('⚠️  WARNING: This will DELETE all display templates from your CMS!');
        console.log('   This action cannot be undone.\n');

        const confirmed = await askConfirmation('Are you sure you want to delete ALL templates? (yes/no): ');

        if (!confirmed) {
            console.log('\n❌ Deletion cancelled');
            return;
        }
        console.log('');
    }

    // Delete templates
    let successCount = 0;
    let failCount = 0;

    for (const template of templates) {
        const styleKey = template.key;

        if (dryRun) {
            console.log(`[DRY RUN] Would delete: ${styleKey}`);
            successCount++;
        } else {
            process.stdout.write(`Deleting ${styleKey}... `);
            const success = await deleteDisplayTemplate(styleKey);

            if (success) {
                console.log('✅');
                successCount++;
            } else {
                console.log('❌');
                failCount++;
            }
        }
    }

    // Summary
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('Summary:');
    console.log(`  ${dryRun ? 'Would delete' : 'Deleted'}: ${successCount}`);
    if (failCount > 0) {
        console.log(`  Failed: ${failCount}`);
    }
    console.log('═══════════════════════════════════════════════════════\n');

    if (dryRun) {
        console.log('💡 To actually delete templates, use --force flag');
        console.log('   Example: yarn styles:delete-all --force --yes\n');
    } else if (successCount > 0) {
        console.log('✅ All templates deleted successfully!');
        console.log('💡 To restore, run: yarn styles:push\n');
    }
})();
