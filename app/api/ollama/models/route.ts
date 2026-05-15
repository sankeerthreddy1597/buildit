export async function GET() {
  try {
    const res = await fetch('http://localhost:11434/api/tags', {
      signal: AbortSignal.timeout(2000),
    })
    if (!res.ok) return Response.json({ models: [] })

    const data = await res.json()
    const models: string[] = (data.models ?? []).map(
      (m: { name: string }) => m.name,
    )
    return Response.json({ models })
  } catch {
    // Ollama not running — degrade gracefully
    return Response.json({ models: [] })
  }
}
