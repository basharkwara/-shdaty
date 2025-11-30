export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Prompt is required" }), {
      status: 400,
    });
  }

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "db21e45a0e4c8b2f73d4c7414bdb331cb1308d74d249b36c60c3a41143c7cdf0",
        input: { prompt },
      }),
    });

    const data = await response.json();

    if (data?.error) {
      return new Response(JSON.stringify({ error: data.error }), { status: 500 });
    }

    if (!data.output || !Array.isArray(data.output) || data.output.length === 0) {
      return new Response(JSON.stringify({ error: "No output image received" }), { status: 500 });
    }

    return new Response(JSON.stringify({ image: data.output[0] }), { status: 200 });
  } catch (error) {
    console.error("Image generation error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}