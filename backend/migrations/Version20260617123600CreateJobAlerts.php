<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617123600CreateJobAlerts extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create job_alerts table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE job_alerts (
            id INT AUTO_INCREMENT NOT NULL,
            user_id INT NOT NULL,
            keyword VARCHAR(180) NOT NULL,
            location VARCHAR(150) DEFAULT NULL,
            frequency VARCHAR(40) NOT NULL DEFAULT "daily",
            email_enabled TINYINT(1) NOT NULL DEFAULT 1,
            is_active TINYINT(1) NOT NULL DEFAULT 1,
            last_sent_at DATETIME DEFAULT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX IDX_JOB_ALERTS_USER (user_id),
            INDEX IDX_JOB_ALERTS_ACTIVE (is_active),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE job_alerts ADD CONSTRAINT FK_JOB_ALERTS_USER FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE job_alerts DROP FOREIGN KEY FK_JOB_ALERTS_USER');
        $this->addSql('DROP TABLE job_alerts');
    }
}
