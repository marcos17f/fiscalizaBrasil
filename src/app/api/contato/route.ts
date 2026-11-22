import { NextResponse } from "next/server";

const MAX_ARQUIVOS = 5;
const MAX_BYTES_ARQUIVO = 10 * 1024 * 1024; // 10 MB por arquivo

const EXTENSOES_PERMITIDAS = new Set([
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "csv",
  "txt",
  "jpg",
  "jpeg",
  "png",
  "webp",
  "mp4",
  "mov",
  "webm",
]);

type AnexoResumo = {
  nome: string;
  tamanho: number;
  tipo: string;
};

function validarExtensao(nomeArquivo: string): boolean {
  const ext = nomeArquivo.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSOES_PERMITIDAS.has(ext);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  let canal = "contato";
  let nome = "";
  let email = "";
  let assunto = "";
  let linkFonte = "";
  let mensagem = "";
  let aceitePrivacidade = false;
  const anexos: AnexoResumo[] = [];

  if (contentType.includes("multipart/form-data")) {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Não foi possível ler os dados enviados." },
        { status: 400 }
      );
    }

    canal = String(formData.get("canal") ?? "contato").trim();
    nome = String(formData.get("nome") ?? "").trim();
    email = String(formData.get("email") ?? "").trim();
    assunto = String(formData.get("assunto") ?? "").trim();
    linkFonte = String(formData.get("linkFonte") ?? "").trim();
    mensagem = String(formData.get("mensagem") ?? "").trim();
    aceitePrivacidade = formData.get("aceitePrivacidade") === "true";

    const arquivos = formData.getAll("anexos");
    if (arquivos.length > MAX_ARQUIVOS) {
      return NextResponse.json(
        { error: `Envie no máximo ${MAX_ARQUIVOS} arquivos por protocolo.` },
        { status: 400 }
      );
    }

    for (const entry of arquivos) {
      if (!(entry instanceof File) || entry.size === 0) continue;
      if (entry.size > MAX_BYTES_ARQUIVO) {
        return NextResponse.json(
          {
            error: `O arquivo "${entry.name}" ultrapassa o limite de 10 MB por anexo.`,
          },
          { status: 400 }
        );
      }
      if (!validarExtensao(entry.name)) {
        return NextResponse.json(
          {
            error: `Tipo de arquivo não permitido em "${entry.name}". Envie PDF, DOC, XLS, imagens (JPG/PNG/WEBP) ou vídeos (MP4/MOV/WEBM).`,
          },
          { status: 400 }
        );
      }
      anexos.push({
        nome: entry.name,
        tamanho: entry.size,
        tipo: entry.type || "application/octet-stream",
      });
    }
  } else {
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: "Formato de requisição inválido." },
        { status: 400 }
      );
    }

    canal = String(body.canal ?? "contato").trim();
    nome = String(body.nome ?? "").trim();
    email = String(body.email ?? "").trim();
    assunto = String(body.assunto ?? "").trim();
    linkFonte = String(body.linkFonte ?? "").trim();
    mensagem = String(body.mensagem ?? "").trim();
    aceitePrivacidade = Boolean(body.aceitePrivacidade);
  }

  if (nome.length < 2 || !email.includes("@") || mensagem.length < 10) {
    return NextResponse.json(
      {
        error:
          "Preencha nome, e-mail válido e uma mensagem com pelo menos 10 caracteres.",
      },
      { status: 400 }
    );
  }

  if (linkFonte && !/^https?:\/\/.+/i.test(linkFonte)) {
    return NextResponse.json(
      {
        error:
          "O link informado precisa começar com http:// ou https://.",
      },
      { status: 400 }
    );
  }

  if (!aceitePrivacidade) {
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
    canal,
    assunto,
    linkFonte: linkFonte || null,
    anexos,
    recebidoEm: new Date().toISOString(),
  });
}
