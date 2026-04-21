import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { getProject, getProjects } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  return {
    title: project ? `${project.title} | Nadin Isuf` : "Project | Nadin Isuf",
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <section className="case-hero">
        <img src={project.heroImage} alt="" />
        <div className="case-hero-overlay" />
        <Reveal className="case-title">
          <p className="eyebrow">
            {project.category} · {project.location} · {project.year}
          </p>
          <h1>{project.title}</h1>
          <p>{project.shortDescription}</p>
        </Reveal>
      </section>

      <section className="section case-intro">
        <p className="section-kicker">Concept Description</p>
        <h2>{project.concept}</h2>
      </section>

      <section className="section case-sections">
        <Reveal className="case-section">
          <span>01</span>
          <h2>Concept</h2>
          <p>{project.concept}</p>
        </Reveal>
        <Reveal className="case-section" delay={100}>
          <span>02</span>
          <h2>Spatial Idea</h2>
          <p>{project.spatialIdea}</p>
        </Reveal>
        <Reveal className="case-section" delay={200}>
          <span>03</span>
          <h2>Materials</h2>
          <p>{project.materials}</p>
        </Reveal>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Gallery</p>
        </div>
        <div className="gallery-grid">
          {project.gallery.map((image, index) => (
            <Reveal key={image} delay={index * 80}>
              <img src={image} alt="" />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
