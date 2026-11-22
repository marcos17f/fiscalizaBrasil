import { NextResponse } from "next/server";

type Payload = {
  canal?: string;
  nome?: string;
  email?: string;
  assunto?: string;
  mensagem?: string;
  aceitePrivacidade?: boolean;
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { error: "Formato de requisição inválido." },
      { status: 400 }
    );
  }

  const nome = (body.nome ?? "").trim();
  const email = (body.email ?? "").trim();
  const mensagem = (body.mensagem ?? "").trim();

  if (nome.length < 2 || !email.includes("@") || mensagem.length < 10) {
    return NextResponse.json(
      {
        error:
          "Preencha nome, e-mail válido e uma mensagem com pelo menos 10 caracteres.",
      },
      { status: 400 }
    );
  }

  if (!body.aceitePrivacidade) {
    return NextResponse.json(
      { error: "É necessário concordar com a Política de Privacidade." },
      { status: 400 }
    );
  }

  const sufixo = Math.random().toString(36).slice(2, 8).toUpperCase();
  const protocolo = `FB-${new Date().getFullYear()}-${sufixo}`;

  return NextResponse.json({
    ok: true,
    protocolo,
    canal: body.canal ?? "contato",
    recebidoEm: new Date().toISOString(),
  });
}
