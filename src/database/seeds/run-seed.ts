import { config } from 'dotenv';
import { AppDataSource } from '../data-source';

config();

async function runSeed() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    // Add your seed logic here
    // Example:
    // const userRepository = AppDataSource.getRepository(User);
    // await userRepository.save([...]);

    console.log('Seed completed successfully!');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  }
}

runSeed();
