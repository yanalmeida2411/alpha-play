import * as v from "valibot";

const lettersOnlyRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/;

export const PersonalDataSchema = v.pipe(
  v.object({
    newName: v.optional(
      v.pipe(
        v.string(),
        v.trim(),
        v.check((val) => val === "" || val.length >= 2, "Deve permitir no mínimo 02 caracteres"),
        v.maxLength(20, "Máximo de 20 letras"),
        v.check((val) => val === "" || lettersOnlyRegex.test(val), "O campo nome aceita apenas letras")
      )
    ),
    newSurname: v.optional(
      v.pipe(
        v.string(),
        v.trim(),
        v.check((val) => val === "" || val.length >= 2, "Deve permitir no mínimo 02 caracteres"),
        v.maxLength(20, "Máximo de 20 letras"),
        v.check((val) => val === "" || lettersOnlyRegex.test(val), "O campo sobrenome aceita apenas letras")
      )
    ),
    newEmail: v.optional(
      v.pipe(
        v.string(),
        v.trim(),
        v.check((val) => val === "" || v.safeParse(v.string([v.email()]), val).success, "O e-mail inserido é inválido"),
        v.check((val) => val === "" || /@.*\.(com|com\.br)$/.test(val), "O e-mail inserido é inválido"),
        v.maxLength(50, "O campo e-mail deve permitir no máximo 50 caracteres")
      )
    ),
    pinCode: v.string(), // PIN Atual no formulário
    newPin: v.string(),  // Novo PIN no formulário
  }),
  // Validação: Se preencher um PIN, o outro é obrigatório
  v.forward(
    v.partialCheck(
      [["pinCode"], ["newPin"]],
      (input) => {
        if (input.newPin !== "" && input.pinCode === "") return false;
        if (input.pinCode !== "" && input.newPin === "") return false;
        return true;
      },
      "Para alterar o PIN, preencha o atual e o novo."
    ),
    ["newPin"]
  )
);

export const PasswordSchema = v.pipe(
  v.object({
    oldPassword: v.pipe(v.string("O campo senha é obrigatório."), v.nonEmpty("O campo senha é obrigatório.")),
    newPassword: v.pipe(
      v.string("O campo senha é obrigatório."),
      v.nonEmpty("O campo senha é obrigatório."),
      v.regex(/^\S+$/, "A senha não pode haver espaços em branco."),
      v.minLength(6, "A senha deve conter no mínimo 6 caracteres."),
      v.maxLength(10, "A senha deve conter no máximo 10 caracteres."),
      v.regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula."),
      v.regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula."),
      v.regex(/[0-9]/, "A senha deve conter pelo menos um número."),
      v.regex(
        /[^a-zA-Z0-9]/,
        "A senha deve conter pelo menos um caractere especial.",
      ),
    ),
    confirmPassword: v.pipe(v.string("O campo confirmar senha é obrigatório."), v.nonEmpty("O campo confirmar senha é obrigatório.")),
  }),
  v.forward(
    v.partialCheck(
      [["newPassword"], ["confirmPassword"]],
      (input) => input.newPassword === input.confirmPassword,
      "As senhas não coincidem"
    ),
    ["confirmPassword"]
  ),
);
