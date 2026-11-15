import bcrypt from "bcryptjs";
import pool from "../src/config/database.js";

const adminName = process.env.ADMIN_NAME || "Portfolio Admin";
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const resetAll = process.argv.includes("--reset");

const experiences = [
  {
    position: "Internship Fullstack Web Developer",
    companyName: "PT Elangperdana Tyre Industry",
    startDate: "2023-08-18",
    endDate: "2023-10-18",
    companyLogo:
      "https://res.cloudinary.com/diwfwe2gl/image/upload/v1760852695/portofolio/works/jokgyjofcvc4a4wbvgxw.png",
    techStack: ["Bootstrap", "Laravel", "JavaScript", "MySQL"],
    responsibilities: [
      "Designed and developed a web-based recruitment system.",
      "Analyzed HR system requirements.",
      "Built applicant management features",
      "Implemented admin and user dashboards",
      "Conducted system testing and validation",
    ],
  },
  {
    position: "Administration",
    companyName: "Diah Kenken Fossil Store (Shopee)",
    startDate: "2018-04-14",
    endDate: "2025-12-16",
    companyLogo:
      "https://res.cloudinary.com/diwfwe2gl/image/upload/v1765876385/portofolio/works/a5vdcrdob1i3e3iqru0x.jpg",
    techStack: ["MySQL"],
    responsibilities: [
      "Conducted recap and monitoring of incoming and outgoing goods transactions to ensure stock accuracy.",
      "Prepared profit and expense reports as a basis for sales evaluation.",
      "Managed the packaging and distribution process to various courier services to ensure timely delivery.",
    ],
  },
];

const projects = [
  {
    title: "S.I.P.P.K",
    description:
      "A website-based disease identification system for cats using the Mamdani fuzzy method and certainty factor. This website was built using the Laravel framework and has 99% accuracy for diseases diagnosed by the system.",
    techStack: ["Laravel", "JavaScript", "MySQL", "PHP", "Tailwind"],
    projectImage:
      "https://res.cloudinary.com/diwfwe2gl/image/upload/v1760852846/portofolio/projects/odcn1vqbczvot26phsqn.png",
    repositoryStatus: "private",
    demoStatus: "unavailable",
    linkRepository: "",
    linkDemo: "",
  },
  {
    title: "E-Recrutment",
    description:
      "A website-based recruitment system designed to help manage prospective employee data and manage recruitment flows more efficiently and make it easier for applicants to apply for jobs at PT Elangperdana Tire Industry.",
    techStack: ["Bootstrap", "Laravel", "JavaScript", "MySQL", "PHP"],
    projectImage:
      "https://res.cloudinary.com/diwfwe2gl/image/upload/v1760852919/portofolio/projects/lrdijf7xhumjeeohq4xk.png",
    repositoryStatus: "private",
    demoStatus: "unavailable",
    linkRepository: "",
    linkDemo: "",
  },
  {
    title: "Portfolio 2023",
    description:
      "A portfolio website using vanilla HTML and CSS showcasing a recruitment system for PT Elangperdana Tire Industry, featuring responsive layout, applicant forms, job listings, intuitive navigation, and accessible interface for efficient hiring.",
    techStack: ["Bootstrap", "JavaScript"],
    projectImage:
      "https://res.cloudinary.com/diwfwe2gl/image/upload/v1760853143/portofolio/projects/re3wk6tkgkl094cdp4so.png",
    repositoryStatus: "public",
    demoStatus: "available",
    linkRepository: "https://github.com/dranuest1540/dranuest1540.github.io",
    linkDemo: "https://dranuest1540.github.io/",
  },
];

async function seed() {
  if (!adminEmail || !adminPassword) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before running the seeder");
  }

  if (adminPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters long");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (resetAll) {
      await client.query(
        "TRUNCATE TABLE experience, project, app_user RESTART IDENTITY",
      );
      const sessionTable = await client.query(
        "SELECT to_regclass('public.session') IS NOT NULL AS session_exists",
      );
      if (sessionTable.rows[0].session_exists) {
        await client.query('TRUNCATE TABLE "session"');
      }
    }

    await client.query(
      `INSERT INTO app_user (name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE
       SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash`,
      [adminName, adminEmail, passwordHash],
    );

    const experienceCount = await client.query(
      "SELECT COUNT(*)::int AS count FROM experience",
    );
    if (resetAll || experienceCount.rows[0].count === 0) {
      for (const experience of experiences) {
        await client.query(
          `INSERT INTO experience
            (position, company_name, start_date, end_date, responsibilities, tech_stack, company_logo)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            experience.position,
            experience.companyName,
            experience.startDate,
            experience.endDate,
            experience.responsibilities,
            experience.techStack,
            experience.companyLogo,
          ],
        );
      }
    }

    const projectCount = await client.query(
      "SELECT COUNT(*)::int AS count FROM project",
    );
    if (resetAll || projectCount.rows[0].count === 0) {
      for (const project of projects) {
        await client.query(
          `INSERT INTO project
            (title, description, repository_status, demo_status, tech_stack, project_image, link_repository, link_demo)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            project.title,
            project.description,
            project.repositoryStatus,
            project.demoStatus,
            project.techStack,
            project.projectImage,
            project.linkRepository,
            project.linkDemo,
          ],
        );
      }
    }

    await client.query("COMMIT");
    console.log(
      resetAll
        ? "Reset app data and seeded admin, experiences, and projects"
        : "Seeded admin; portfolio data was added only to empty tables",
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

seed()
  .catch((error) => {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
