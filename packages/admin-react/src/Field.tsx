import { Field as BaseField } from "@base-ui/react/field";
import type { ComponentProps, ReactNode } from "react";
import { cn, type SlotClasses } from "./cn";

export type FieldContainerProps = ComponentProps<typeof BaseField.Root>;

/** The bare `.field` container — for layouts the default `<Field>` doesn't fit. */
function FieldContainer({ className, ...rest }: FieldContainerProps) {
  return <BaseField.Root className={cn("field", className)} {...rest} />;
}

export interface FieldProps extends FieldContainerProps {
  /** Renders as `<Field.Label>`. */
  label?: ReactNode;
  /** Renders as `<Field.Description>`. */
  description?: ReactNode;
  /**
   * Error message, such as a server-side or form-library error. Always shown when set, and marks
   * the field invalid (`[data-invalid]`, `aria-invalid`) unless `invalid` is passed. For messages
   * that follow the control's own validity, compose `<Field.Error>` in `<Field.Container>`.
   */
  error?: ReactNode;
  /**
   * Label-only override of the red asterisk, which otherwise follows the control's own `required`.
   * `true` adds it, for controls with no native `required`; `false` removes it. Validates nothing.
   */
  required?: boolean;
  /** Inline layout (`.field-row`) — control beside its label; pairs with switches and single checkboxes. */
  inline?: boolean;
  /** Per-slot class overrides. `className` targets the root; these target inner slots. */
  classNames?: SlotClasses<"label" | "description" | "error">;
}

/** A shorthand slot renders only for real content; `null`, `false` and `""` count as empty. */
function hasContent(node: ReactNode): boolean {
  return node !== undefined && node !== null && node !== false && node !== "";
}

/** Standard field — label, control (`children`), description, error. For other shapes, compose `<Field.Container>` by hand. */
function FieldRoot({
  label,
  description,
  error,
  required,
  inline,
  invalid,
  className,
  classNames,
  children,
  ...rest
}: FieldProps) {
  const hasError = hasContent(error);
  const labelEl = hasContent(label) ? (
    <FieldLabel required={required} className={classNames?.label}>
      {label}
    </FieldLabel>
  ) : null;
  const descriptionEl = hasContent(description) ? (
    <FieldDescription className={classNames?.description}>{description}</FieldDescription>
  ) : null;
  const errorEl = hasError ? (
    <FieldError match={true} className={classNames?.error}>
      {error}
    </FieldError>
  ) : null;
  return (
    <FieldContainer
      className={cn(inline && "field-row", className)}
      invalid={invalid ?? (hasError || undefined)}
      {...rest}
    >
      {inline ? (
        <>
          {children}
          {labelEl}
        </>
      ) : (
        <>
          {labelEl}
          {children}
        </>
      )}
      {descriptionEl}
      {errorEl}
    </FieldContainer>
  );
}

export type FieldLabelProps = ComponentProps<typeof BaseField.Label> & {
  /**
   * Overrides the red asterisk via `data-required`: `true` adds it, `false` removes it. Unset, the
   * asterisk follows a `required` control only when this label is a direct child of the field, so
   * a label wrapped in another element needs `true`. Validates nothing.
   */
  required?: boolean;
};

function FieldLabel({ className, required, ...rest }: FieldLabelProps) {
  return (
    <BaseField.Label
      data-required={required === undefined ? undefined : required ? "" : "false"}
      className={cn("field-label", className)}
      {...rest}
    />
  );
}

export type FieldDescriptionProps = ComponentProps<typeof BaseField.Description>;

function FieldDescription({ className, ...rest }: FieldDescriptionProps) {
  return <BaseField.Description className={cn("field-description", className)} {...rest} />;
}

export type FieldErrorProps = ComponentProps<typeof BaseField.Error>;

function FieldError({ className, ...rest }: FieldErrorProps) {
  return <BaseField.Error className={cn("field-error", className)} {...rest} />;
}

export const Field = Object.assign(FieldRoot, {
  Container: FieldContainer,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
});
