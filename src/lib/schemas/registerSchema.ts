import {
  object,
  string,
  boolean,
  email,
  minLength,
  maxLength,
  regex,
  pipe,
  nonEmpty,
  forward,
  trim,
  InferInput,
  partialCheck,
  literal,
} from "valibot";

export const registerSchema = pipe(
  object({
    name: pipe(
      string("O campo nome é obrigatório"),
      nonEmpty("O campo nome é obrigatório"),
      trim(),
      minLength(2, "O campo nome deve conter entre 2 e 50 caracteres"),
      maxLength(50, "O campo nome deve conter entre 2 e 50 caracteres"),
      regex(
        /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/,
        "O campo Nome aceita apenas letras, acentuação e espaços",
      ),
    ),

    surname: pipe(
      string("O campo sobrenome é obrigatório"),
      nonEmpty("O campo sobrenome é obrigatório"),
      trim(),
      minLength(2, "O campo Sobrenome deve conter entre 2 e 50 caracteres"),
      maxLength(50, "O campo Sobrenome deve conter entre 2 e 50 caracteres"),
      regex(
        /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/,
        "O campo Sobrenome aceita apenas letras, acentuação e espaços",
      ),
    ),

    email: pipe(
      string("O campo e-mail é obrigatório."),
      nonEmpty("O campo e-mail é obrigatório."),
      trim(),
      email("O formato do e-mail parece inválido."),
      regex(
        /@.*\.(com|com\.br)$/,
        "O campo e-mail deve ter o formato (nome@dominio.com ou nome@dominio.com.br)",
      ),
      maxLength(50, "O campo e-mail deve permitir no máximo 50 caracteres"),
    ),

    password: pipe(
      string("O campo senha é obrigatório."),
      nonEmpty("O campo senha é obrigatório."),
      regex(/^\S+$/, "A senha não pode haver espaços em branco."),
      minLength(6, "A senha deve conter no mínimo 6 caracteres."),
      maxLength(10, "A senha deve conter no máximo 10 caracteres."),
      regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula."),
      regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula."),
      regex(/[0-9]/, "A senha deve conter pelo menos um número."),
      regex(
        /[^a-zA-Z0-9]/,
        "A senha deve conter pelo menos um caractere especial.",
      ),
    ),

    confirmPassword: pipe(
      string("O campo confirmar senha é obrigatório."),
      nonEmpty("O campo confirmar senha é obrigatório."),
    ),

    pinCode: pipe(
      string("O campo PIN é obrigatório."),
      nonEmpty("O campo PIN é obrigatório."),
      minLength(4, "O campo PIN deve ter exatamente 4 números."),
      maxLength(4, "O campo PIN deve ter exatamente 4 números."),
      regex(/^\d+$/, "O PIN deve conter apenas números."),
    ),

    termsAccepted: pipe(
      boolean(),
      literal(true, "Você deve aceitar os Termos e Políticas."),
    ),
  }),

  forward(
    partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "As senhas devem ser iguais.",
    ),
    ["confirmPassword"],
  ),
);

export type registerSchema = InferInput<typeof registerSchema>;
