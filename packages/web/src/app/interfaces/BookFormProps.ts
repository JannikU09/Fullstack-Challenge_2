import type { Author } from "./Author";
import type { BookInitialValues } from "./BookInitialValues";
import type { BookWithAuthor } from "./BookWithAuthor";

export interface BookFormProps {
  initialValues?: BookInitialValues;
  authors: Author[];
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement>, data: BookWithAuthor) => Promise<void> | void;
  submitLabel?: string;
}
