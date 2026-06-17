<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617122600CreateCompanies extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create companies table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE companies (
            id INT AUTO_INCREMENT NOT NULL,
            name VARCHAR(150) NOT NULL,
            slug VARCHAR(180) NOT NULL,
            industry VARCHAR(120) DEFAULT NULL,
            location VARCHAR(150) DEFAULT NULL,
            size_range VARCHAR(50) DEFAULT NULL,
            description LONGTEXT DEFAULT NULL,
            website VARCHAR(255) DEFAULT NULL,
            founded_year SMALLINT DEFAULT NULL,
            logo_url VARCHAR(255) DEFAULT NULL,
            cover_theme VARCHAR(100) DEFAULT NULL,
            status VARCHAR(30) NOT NULL DEFAULT "active",
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE INDEX UNIQ_COMPANIES_SLUG (slug),
            INDEX IDX_COMPANIES_STATUS (status),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE companies');
    }
}
