const fs = require('fs');

const schema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Company {
  id                String    @id @default(cuid())
  corporateNumber   String    @unique
  name              String
  nameKana          String?
  description       String?
  establishedDate   DateTime?
  capital           BigInt?
  employees         Int?
  website           String?
  
  // gBizINFO連携
  gBizLastUpdated   DateTime?
  gBizData          Json?
  
  // カスタムデータ
  logoUrl           String?
  coverImageUrl     String?
  isVerified        Boolean   @default(false)
  isPremium         Boolean   @default(false)
  
  // リレーション
  serviceAreas      ServiceArea[]
  priceRanges       PriceRange[]
  specialties       Specialty[]
  reviews           Review[]
  projects          Project[]
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

model ServiceArea {
  id          String    @id @default(cuid())
  companyId   String
  prefecture  String
  city        String?
  coverage    String    @default("FULL")
  remarks     String?
  
  company     Company   @relation(fields: [companyId], references: [id])
  
  @@unique([companyId, prefecture, city])
}

model PriceRange {
  id          String    @id @default(cuid())
  companyId   String
  productName String
  minPrice    Int
  maxPrice    Int
  avgPrice    Int?
  includeItems String[]
  remarks     String?
  
  company     Company   @relation(fields: [companyId], references: [id])
}

model Specialty {
  id          String    @id @default(cuid())
  companyId   String
  category    String
  value       String
  
  company     Company   @relation(fields: [companyId], references: [id])
  
  @@unique([companyId, category, value])
}

model Review {
  id              String    @id @default(cuid())
  companyId       String
  userId          String?
  
  contractYear    Int
  completionYear  Int?
  prefecture      String
  city            String?
  
  totalPrice      Int?
  pricePerTsubo   Int?
  houseSize       Float?
  
  overallRating   Float
  priceRating     Float?
  qualityRating   Float?
  serviceRating   Float?
  
  title           String
  content         String
  pros            String?
  cons            String?
  
  images          ReviewImage[]
  
  isVerified      Boolean   @default(false)
  
  company         Company   @relation(fields: [companyId], references: [id])
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model ReviewImage {
  id        String    @id @default(cuid())
  reviewId  String
  url       String
  caption   String?
  
  review    Review    @relation(fields: [reviewId], references: [id])
}

model Project {
  id          String    @id @default(cuid())
  companyId   String
  title       String
  description String?
  prefecture  String
  city        String?
  
  houseType   String
  structure   String
  size        Float?
  
  priceRange  String?
  
  images      ProjectImage[]
  
  company     Company   @relation(fields: [companyId], references: [id])
  
  createdAt   DateTime  @default(now())
}

model ProjectImage {
  id        String    @id @default(cuid())
  projectId String
  url       String
  caption   String?
  order     Int       @default(0)
  
  project   Project   @relation(fields: [projectId], references: [id])
}`;

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('✅ prisma/schema.prismaを作成しました');
