-- CreateTable
CREATE TABLE "notes" (
    "note_id" SERIAL NOT NULL,
    "note_name" VARCHAR(255),
    "json_file" VARCHAR,
    "world_id" INTEGER,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("note_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "email" VARCHAR(255),
    "firebase_id" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "worlds" (
    "world_id" SERIAL NOT NULL,
    "world_name" VARCHAR(255),
    "user_id" INTEGER,

    CONSTRAINT "worlds_pkey" PRIMARY KEY ("world_id")
);

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_world_id_fkey" FOREIGN KEY ("world_id") REFERENCES "worlds"("world_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "worlds" ADD CONSTRAINT "worlds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
