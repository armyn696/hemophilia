import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

const newsData = [
    {
        title: 'New Treatment Guidelines Released',
        excerpt: 'The World Federation of Hemophilia has released updated treatment guidelines for 2025.',
        content: 'The World Federation of Hemophilia (WFH) has published its 3rd edition of the Guidelines for the Management of Hemophilia. These guidelines feature new recommendations on genetic assessment, prophylactic treatment, and emergency care.',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
        category: 'Medical',
        author: 'Dr. Sarah Smith'
    },
    {
        title: 'Community Support Event in Birjand',
        excerpt: 'Join us for our annual community gathering and support session this Friday.',
        content: 'We are excited to announce our upcoming community gathering at the Birjand Hemophilia Center. This event will provide a safe space for patients and families to share experiences and receive support from mental health professionals.',
        image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80',
        category: 'Community',
        author: 'Admin'
    },
    {
        title: 'Breakthrough in Gene Therapy Research',
        excerpt: 'Recent studies show promising results for long-term gene therapy efficacy.',
        content: 'A new study published in the New England Journal of Medicine highlights the success of AAV5-based gene therapy in sustained factor VIII production. This marks a significant milestone in the journey towards a functional cure.',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
        category: 'Research',
        author: 'Medical Board'
    },
    {
        title: 'Hemophilia Awareness Month Activities',
        excerpt: 'Check out the schedule for this month\'s awareness campaign and school programs.',
        content: 'April is Hemophilia Awareness Month! We have organized a series of workshops in local high schools to educate students about bleeding disorders. Volunteers are needed to help distribute brochures and facilitate sessions.',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
        category: 'Events',
        author: 'Outreach Team'
    }
];

// Simple random ID generator (sufficient for string ID)
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

async function main() {
    try {
        console.log('Connecting to DB via pg...');
        await client.connect();
        console.log('Connected!');

        for (const news of newsData) {
            console.log(`Inserting: ${news.title}`);
            const id = generateId();
            // Using double quotes for table name "News" to match case sensitivity if created by Prisma
            const query = `
        INSERT INTO "News" (id, title, excerpt, content, image, category, author, date, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW())
      `;
            await client.query(query, [id, news.title, news.excerpt, news.content, news.image, news.category, news.author]);
        }

        console.log('Seeding finished successfully.');
    } catch (err) {
        console.error('Error seeding:', err);
    } finally {
        await client.end();
    }
}

main();
