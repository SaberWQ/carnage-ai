import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { model_id, epochs, batch_size, learning_rate } = body

    if (!model_id || !epochs || !batch_size || !learning_rate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const { data: model, error: modelError } = await supabase
      .from("models")
      .select("id")
      .eq("id", model_id)
      .eq("user_id", user.id)
      .maybeSingle()

    if (modelError) {
      return NextResponse.json({ error: modelError.message }, { status: 500 })
    }

    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    const { data: session, error } = await supabase
      .from("training_sessions")
      .insert({
        model_id,
        user_id: user.id,
        epochs,
        batch_size,
        learning_rate,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ session }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: sessions, error } = await supabase
      .from("training_sessions")
      .select(`
        *,
        models (
          id,
          name
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ sessions })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
