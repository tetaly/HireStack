# HireStack database structure

Cette structure est basee sur les pages du frontend React :

- public : offres, details d'offre, entreprises, details entreprise
- auth : login, register avec roles `admin`, `recruiter`, `seeker`
- seeker : recherche, candidatures, profil, alertes
- recruiter : dashboard, mes offres, publier une offre, candidats
- admin : utilisateurs, offres, statistiques

## Tables principales

### users
Comptes de connexion pour tous les roles.

Champs importants :
- `email`, `password_hash`
- `first_name`, `last_name`, `phone`, `avatar_url`
- `role` : `admin`, `recruiter`, `seeker`
- `status` : `active`, `suspended`, `deleted`

### companies
Entreprises visibles dans `/companies` et rattachees aux offres.

Champs importants :
- `name`, `slug`, `industry`, `location`, `size_range`
- `description`, `website`, `founded_year`
- `logo_url`, `cover_theme`
- `status`

### company_members
Lien entre les recruteurs et leur entreprise.

Relation :
- un utilisateur recruteur peut appartenir a une entreprise
- une entreprise peut avoir plusieurs recruteurs

### seeker_profiles
Profil candidat visible dans l'espace chercheur.

Champs importants :
- `headline`, `location`, `bio`
- `availability_status`
- `years_experience`
- `resume_url`

### jobs
Offres d'emploi visibles dans `/jobs`, gerees par recruteur et admin.

Champs importants :
- `company_id`, `recruiter_id`
- `title`, `slug`, `category`
- `contract_type` : `cdi`, `cdd`, `freelance`, `stage`, `alternance`
- `location`, `work_mode`
- `salary_min`, `salary_max`, `salary_currency`
- `description`, `profile_required`, `benefits`
- `status` : `draft`, `pending`, `active`, `expired`, `closed`, `rejected`
- `featured`, `views_count`, `applications_count`
- `published_at`, `expires_at`

### skills
Liste unique des competences : React, Node.js, SQL, Docker, etc.

### job_skills
Competences demandees pour une offre.

### seeker_skills
Competences ajoutees au profil candidat.

### seeker_experiences
Experiences professionnelles du candidat.

Champs importants :
- `title`, `company_name`
- `description`
- `start_date`, `end_date`, `is_current`
- `position_order`

### applications
Candidatures envoyees par les candidats.

Champs importants :
- `job_id`, `seeker_id`
- `cover_letter`, `resume_url`
- `status` : `new`, `seen`, `in_review`, `interview`, `pending`, `accepted`, `rejected`
- `match_score`
- `recruiter_note`
- `applied_at`

### saved_jobs
Offres sauvegardees par un candidat.

### job_alerts
Alertes emploi du candidat.

Champs importants :
- `keyword`, `location`
- `frequency` : `daily`, `weekly`
- `email_enabled`, `is_active`
- `last_sent_at`

### job_views
Historique simple des vues d'offres pour alimenter les statistiques recruteur/admin.

### auth_tokens
Tokens d'authentification API apres login/register.

Champs importants :
- `user_id`
- `token_hash`
- `expires_at`

## Migrations

Les migrations Doctrine sont separees par table et s'executent dans l'ordre des timestamps :

- `Version20260617122500CreateUsers.php` : `users`
- `Version20260617122600CreateCompanies.php` : `companies`
- `Version20260617122700CreateCompanyMembers.php` : `company_members`
- `Version20260617122800CreateSeekerProfiles.php` : `seeker_profiles`
- `Version20260617122900CreateJobs.php` : `jobs`
- `Version20260617123000CreateSkills.php` : `skills`
- `Version20260617123100CreateJobSkills.php` : `job_skills`
- `Version20260617123200CreateSeekerSkills.php` : `seeker_skills`
- `Version20260617123300CreateSeekerExperiences.php` : `seeker_experiences`
- `Version20260617123400CreateApplications.php` : `applications`
- `Version20260617123500CreateSavedJobs.php` : `saved_jobs`
- `Version20260617123600CreateJobAlerts.php` : `job_alerts`
- `Version20260617123700CreateJobViews.php` : `job_views`
- `Version20260617123800CreateAuthTokens.php` : `auth_tokens`

Commande pour les executer :

```bash
php bin/console doctrine:migrations:migrate
```
