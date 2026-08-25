// Builds a short, natural-language narration script for a project entirely
// from data already on the page — no external AI call, no API key needed.
// This is what gets "spoken" by the typewriter narrator when a track plays.
export function buildNarration(project) {
  if (!project) return "";

  const topAchievement = project.achievements?.[0]?.name;
  const stackList = project.stack?.slice(0, 4).join(", ");

  return [
    `Now playing: ${project.title}.`,
    project.tagline,
    `Built on ${project.architecture}${stackList ? `, using ${stackList}` : ""}.`,
    project.description,
    topAchievement ? `Worth noting — ${topAchievement}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
}