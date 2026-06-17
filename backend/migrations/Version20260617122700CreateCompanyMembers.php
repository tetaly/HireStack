<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260617122700CreateCompanyMembers extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create company_members table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE company_members (
            id INT AUTO_INCREMENT NOT NULL,
            user_id INT NOT NULL,
            company_id INT NOT NULL,
            member_role VARCHAR(50) NOT NULL DEFAULT "recruiter",
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE INDEX UNIQ_COMPANY_MEMBER (user_id, company_id),
            INDEX IDX_COMPANY_MEMBERS_USER (user_id),
            INDEX IDX_COMPANY_MEMBERS_COMPANY (company_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE company_members ADD CONSTRAINT FK_COMPANY_MEMBERS_USER FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE company_members ADD CONSTRAINT FK_COMPANY_MEMBERS_COMPANY FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE company_members DROP FOREIGN KEY FK_COMPANY_MEMBERS_COMPANY');
        $this->addSql('ALTER TABLE company_members DROP FOREIGN KEY FK_COMPANY_MEMBERS_USER');
        $this->addSql('DROP TABLE company_members');
    }
}
