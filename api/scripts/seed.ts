import { PrismaClient, Role, BookingStatus } from '../generated/prisma/default.js';
import { hash } from 'bcryptjs';
import { fillDatabaseWithMovies } from './data-fetch.js';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seeding...');

    // Clear existing data
    await clearDatabase();
    await fillDatabaseWithMovies();

    // Create users
    const admin = await prisma.user.create({
        data: {
            email: 'admin@cinema.com',
            password: await hash('admin123', 12),
            name: 'Admin User',
            role: Role.ADMIN,
        },
    });

    const users = await Promise.all([
        prisma.user.create({
            data: {
                email: 'user1@example.com',
                password: await hash('password1', 12),
                name: 'Regular User 1',
            },
        }),
        prisma.user.create({
            data: {
                email: 'user2@example.com',
                password: await hash('password2', 12),
                name: 'Regular User 2',
            },
        }),
        prisma.user.create({
            data: {
                email: 'user3@example.com',
                password: await hash('password3', 12),
                name: 'Regular User 3',
            },
        }),
    ]);

    console.log('Created 1 admin and 3 regular users');

    // Create movie halls with seats
    const halls = await Promise.all([
        prisma.hall.create({
            data: {
                name: 'Hall A - Dolby Atmos',
                seats: {
                    createMany: {
                        data: generateSeats(10, 15), // 10 rows, 15 seats each
                    },
                },
            },
            include: { seats: true },
        }),
        prisma.hall.create({
            data: {
                name: 'Hall B - IMAX',
                seats: {
                    createMany: {
                        data: generateSeats(8, 12), // 8 rows, 12 seats each
                    },
                },
            },
            include: { seats: true },
        }),
    ]);

    console.log(`Created ${halls.length} halls with seats`);

    // Create some movies (assuming you have movies in your DB)
    const movies = await prisma.movie.findMany({
        take: 5,
        orderBy: { releaseDate: 'desc' },
    });

    if (movies.length === 0) {
        console.warn('No movies found in database. Please run your TMDB import script first.');
        return;
    }

    // Create showtimes (relative to current date)
    const now = new Date();
    const showtimes = await Promise.all([
        // Today
        prisma.showtime.create({
            data: {
                movieId: movies[0].id,
                hallId: halls[0].id,
                time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0), // Today at 14:00
                price: 12.5,
            },
        }),
        prisma.showtime.create({
            data: {
                movieId: movies[1].id,
                hallId: halls[1].id,
                time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 30), // Today at 17:30
                price: 15.0,
            },
        }),
        // Tomorrow
        prisma.showtime.create({
            data: {
                movieId: movies[2].id,
                hallId: halls[0].id,
                time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 16, 0), // Tomorrow at 16:00
                price: 13.5,
            },
        }),
        prisma.showtime.create({
            data: {
                movieId: movies[3].id,
                hallId: halls[1].id,
                time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 19, 0), // Tomorrow at 19:00
                price: 16.0,
            },
        }),
        // Next week
        prisma.showtime.create({
            data: {
                movieId: movies[4].id,
                hallId: halls[0].id,
                time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 20, 0), // Next week same day at 20:00
                price: 14.0,
            },
        }),
    ]);

    console.log(`Created ${showtimes.length} showtimes`);

    // Create some favorites
    await Promise.all([
        prisma.favorite.create({
            data: {
                userId: users[0].id,
                movieId: movies[0].id,
            },
        }),
        prisma.favorite.create({
            data: {
                userId: users[0].id,
                movieId: movies[2].id,
            },
        }),
        prisma.favorite.create({
            data: {
                userId: users[1].id,
                movieId: movies[1].id,
            },
        }),
        prisma.favorite.create({
            data: {
                userId: users[2].id,
                movieId: movies[3].id,
            },
        }),
    ]);

    console.log('Created some favorite movie relationships');

    console.log('Database seeding completed successfully!');
}

// Helper function to generate seats for a hall
function generateSeats(rows: number, seatsPerRow: number) {
    const seats = [];
    for (let row = 1; row <= rows; row++) {
        for (let number = 1; number <= seatsPerRow; number++) {
            seats.push({ row, number });
        }
    }
    return seats;
}

// Clear database function
async function clearDatabase() {
    const tablenames = await prisma.$queryRaw<
        Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    for (const { tablename } of tablenames) {
        if (tablename !== '_prisma_migrations') {
            try {
                await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
            } catch (error) {
                console.log({ error });
            }
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });