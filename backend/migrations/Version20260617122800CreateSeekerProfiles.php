<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617122800CreateSeekerProfiles extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create seeker_profiles table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE seeker_profiles (
            id INT AUTO_INCREMENT NOT NULL,
            user_id INT NOT NULL,
            headline VARCHAR(180) DEFAULT NULL,
            location VARCHAR(150) DEFAULT NULL,
            bio LONGTEXT DEFAULT NULL,
            availability_status VARCHAR(40) NOT NULL DEFAULT "available",
            years_experience SMALLINT DEFAULT NULL,
            resume_url VARCHAR(255) DEFAULT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE INDEX UNIQ_SEEKER_PROFILE_USER (user_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE seeker_profiles ADD CONSTRAINT FK_SEEKER_PROFILES_USER FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE seeker_profiles DROP FOREIGN KEY FK_SEEKER_PROFILES_USER');
        $this->addSql('DROP TABLE seeker_profiles');
    }
}
