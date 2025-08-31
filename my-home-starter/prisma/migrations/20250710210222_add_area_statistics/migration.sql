-- CreateTable
CREATE TABLE "AreaStatistics" (
    "id" TEXT NOT NULL,
    "prefectureCode" TEXT NOT NULL,
    "cityCode" TEXT NOT NULL,
    "population" INTEGER,
    "households" INTEGER,
    "schools" INTEGER,
    "dataYear" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AreaStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AreaStatistics_prefectureCode_cityCode_dataYear_key" ON "AreaStatistics"("prefectureCode", "cityCode", "dataYear");
