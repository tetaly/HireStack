<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617123000CreateSkills extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create skills table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE skills (
            id INT AUTO_INCREMENT NOT NULL,
            name VARCHAR(100) NOT NULL,
            slug VARCHAR(120) NOT NULL,
            UNIQUE INDEX UNIQ_SKILLS_SLUG (slug),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE skills');
    }
}
