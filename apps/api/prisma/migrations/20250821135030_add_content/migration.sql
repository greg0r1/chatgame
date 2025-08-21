-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "usageName" TEXT NOT NULL,
    "photoUrl" TEXT,
    "description" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "seq" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "signal" TEXT NOT NULL,
    "textFr" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_contactId_level_seq_idx" ON "public"."Message"("contactId", "level", "seq");

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
