import { PrismaClient, Role, BookingStatus, Prisma } from '../../generated/prisma/default.js';
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
    const SHOWTIME_CONFIG = [
        { time: '14:00', price: 12.5 },  // Matinee
        { time: '17:30', price: 15.0 },  // Early evening
        { time: '20:00', price: 18.0 },  // Prime time
        { time: '22:30', price: 15.0 }   // Late night
    ];

    const MOVIES_PER_DAY = 2;  // How many different movies to show each day
    const DAYS_TO_SCHEDULE = 7; // Schedule for next 7 days

    async function createWeeklyShowtimes() {
        // Get available movies and halls
        const movies = await prisma.movie.findMany({
            take: MOVIES_PER_DAY * 2, // Get enough movies for rotation
            orderBy: { releaseDate: 'desc' }
        });

        const halls = await prisma.hall.findMany();

        if (movies.length === 0 || halls.length === 0) {
            throw new Error('Need at least one movie and hall to create showtimes');
        }

        const now = new Date();
        const showtimes = [];

        // Create showtimes for each day
        for (let dayOffset = 0; dayOffset < DAYS_TO_SCHEDULE; dayOffset++) {
            const currentDate = new Date(now);
            currentDate.setDate(now.getDate() + dayOffset);

            // Reset time to midnight for date operations
            currentDate.setHours(0, 0, 0, 0);

            // Alternate movies between days
            const movieOffset = dayOffset % 2;

            // Create showtimes for each time slot
            for (const [slotIndex, slot] of SHOWTIME_CONFIG.entries()) {
                // Alternate halls for each time slot
                const hallIndex = slotIndex % halls.length;
                const movieIndex = (movieOffset + slotIndex) % movies.length;

                const [hours, minutes] = slot.time.split(':').map(Number);
                const showtimeDate = new Date(currentDate);
                showtimeDate.setHours(hours, minutes);

                // Check if hall is available (optional)
                const conflictingShowtime = await prisma.showtime.findFirst({
                    where: {
                        hallId: halls[hallIndex].id,
                        time: {
                            // 30 minutes buffer between showtimes
                            gte: new Date(showtimeDate.getTime() - 30 * 60000),
                            lte: new Date(showtimeDate.getTime() + 30 * 60000)
                        }
                    }
                });

                if (!conflictingShowtime) {
                    const showtime = await prisma.showtime.create({
                        data: {
                            movieId: movies[movieIndex].id,
                            hallId: halls[hallIndex].id,
                            time: showtimeDate,
                            price: slot.price
                        }
                    });
                    showtimes.push(showtime);
                }
            }
        }

        return showtimes;
    }

    const showtimes = await createWeeklyShowtimes();
    console.log(`Created ${showtimes.length} showtimes`);

    console.log('Created some favorite movie relationships');

    console.log('Database seeding completed successfully!');
}

// Helper function to generate seats for a hall
function generateSeats(rows: number, seatsPerRow: number) {
    const seats: any[] = [];
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