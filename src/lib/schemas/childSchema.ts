import {
  object,
  string,
  minLength,
  maxLength,
  regex,
  custom,
  pipe,
  transform,
  type InferOutput,
} from "valibot";

export const ChildSchema = object({
  name: pipe(
    string("O campo Nome é obrigatório."),
    minLength(2, "O campo Nome deve conter entre 2 e 10 caracteres."),
    maxLength(10, "O campo Nome deve conter entre 2 e 10 caracteres."),
    regex(
      /^[a-zA-Z\u00C0-\u00FF]+$/,
      "O campo Nome aceita apenas letras e acentuação (uma única palavra).",
    ),
    transform((input) => {
      return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    }),
  ),

  birthDate: pipe(
    string("O campo Data de Nascimento é obrigatório."),
    regex(
      /^\d{2}\/\d{2}\/\d{4}$/,
      "O campo Data de Nascimento deve seguir o formato DD/MM/AAAA.",
    ),
    custom((value) => {
      const dateStr = value as string;
      const parts = dateStr.split("/");

      if (parts.length !== 3) return false;

      const day = Number(parts[0]);
      const month = Number(parts[1]);
      const year = Number(parts[2]);

      if (isNaN(day) || isNaN(month) || isNaN(year)) return false;

      const isoDate = new Date(year, month - 1, day);

      const isValidDate =
        isoDate.getFullYear() === year &&
        isoDate.getMonth() === month - 1 &&
        isoDate.getDate() === day;

      return isValidDate && year >= 1900;
    }, "Data inválida ou ano menor que 1900."),
  ),

  avatar: pipe(
    string("O campo Avatar é obrigatório."),
    minLength(1, "Selecione um avatar."),
  ),
});

export type ChildSchemaType = InferOutput<typeof ChildSchema>;
