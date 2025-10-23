const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create categories
  const categories = [
    {
      name: 'Academic Issues',
      description: 'Concerns related to courses, exams, and academic programs',
      icon: 'fa-graduation-cap',
      color: '#4361ee'
    },
    {
      name: 'Infrastructure',
      description: 'Issues with buildings, classrooms, and campus facilities',
      icon: 'fa-building',
      color: '#3f37c9'
    },
    {
      name: 'Hostel & Accommodation',
      description: 'Concerns about hostel facilities and accommodation',
      icon: 'fa-bed',
      color: '#4cc9f0'
    },
    {
      name: 'Library Services',
      description: 'Feedback about library resources and services',
      icon: 'fa-book',
      color: '#7209b7'
    },
    {
      name: 'IT & Technology',
      description: 'Issues with internet, computers, and technical services',
      icon: 'fa-laptop',
      color: '#f72585'
    },
    {
      name: 'Food & Dining',
      description: 'Feedback about cafeteria and food services',
      icon: 'fa-utensils',
      color: '#4caf50'
    },
    {
      name: 'Sports & Recreation',
      description: 'Concerns about sports facilities and recreational activities',
      icon: 'fa-futbol',
      color: '#ff9800'
    },
    {
      name: 'Health Services',
      description: 'Issues related to campus health center and medical services',
      icon: 'fa-heartbeat',
      color: '#f44336'
    },
    {
      name: 'Transportation',
      description: 'Feedback about campus transportation and parking',
      icon: 'fa-bus',
      color: '#9c27b0'
    },
    {
      name: 'Safety & Security',
      description: 'Concerns about campus safety and security measures',
      icon: 'fa-shield-alt',
      color: '#e91e63'
    },
    {
      name: 'Administration',
      description: 'Issues with administrative processes and services',
      icon: 'fa-user-tie',
      color: '#607d8b'
    },
    {
      name: 'Other',
      description: 'Other concerns not covered by above categories',
      icon: 'fa-ellipsis-h',
      color: '#795548'
    }
  ];

  console.log('Creating categories...');
  for (const category of categories) {
    await prisma.category.create({
      data: category
    });
  }

  // Create admin user
  console.log('Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@campusvoice.edu',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: true,
      isActive: true
    }
  });

  // Create sample student user
  console.log('Creating sample student user...');
  const studentPassword = await bcrypt.hash('student123', 10);
  
  const studentUser = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'student@campusvoice.edu',
      password: studentPassword,
      role: 'STUDENT',
      emailVerified: true,
      isActive: true,
      department: 'Computer Science',
      yearOfStudy: 3
    }
  });

  // Create sample feedback
  console.log('Creating sample feedback...');
  const academicCategory = await prisma.category.findFirst({
    where: { name: 'Academic Issues' }
  });

  if (academicCategory) {
    await prisma.feedback.create({
      data: {
        userId: studentUser.id,
        categoryId: academicCategory.id,
        title: 'Need more study materials for Data Structures course',
        description: 'The current study materials for CS 301 are insufficient. We need more practice problems and detailed explanations for complex algorithms.',
        priority: 'HIGH',
        status: 'PENDING',
        location: 'Computer Science Department'
      }
    });
  }

  console.log('Database seed completed successfully!');
  console.log('\nDefault credentials:');
  console.log('Admin: admin@campusvoice.edu / admin123');
  console.log('Student: student@campusvoice.edu / student123');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
