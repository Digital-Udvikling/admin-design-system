import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./Checkbox";
import { Table } from "./Table";

describe("Table", () => {
  it("renders a full composition", () => {
    render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Ada</Table.Cell>
            <Table.Cell>ada@example.com</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const table = screen.getByRole("table");
    expect(table).toHaveAdminClass("table");
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute("scope", "col");
    expect(screen.getByRole("cell", { name: "ada@example.com" })).toBeInTheDocument();
  });

  it("emits modifier classes on the root", () => {
    render(
      <Table striped bordered relaxed sticky data-testid="t">
        <Table.Body>
          <Table.Row>
            <Table.Cell>x</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByTestId("t")).toHaveAdminClass(
      "table",
      "table-striped",
      "table-bordered",
      "table-relaxed",
      "table-sticky",
    );
  });

  it("Table.Cell composes align, numeric, and gutter modifiers", () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell gutter data-testid="gutter">
              !
            </Table.Cell>
            <Table.Cell align="right" numeric data-testid="numeric">
              42
            </Table.Cell>
            <Table.Cell align="center" data-testid="center">
              c
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByTestId("gutter")).toHaveAdminClass("table-cell", "table-cell-gutter");
    expect(screen.getByTestId("numeric")).toHaveAdminClass("table-cell", "table-cell-numeric");
    expect(screen.getByTestId("numeric")).toHaveAttribute("data-align", "right");
    expect(screen.getByTestId("center")).toHaveAttribute("data-align", "center");
  });

  it("Table.Row exposes selected and asLink hooks", () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row selected data-testid="r-selected">
            <Table.Cell>s</Table.Cell>
          </Table.Row>
          <Table.Row asLink data-testid="r-link">
            <Table.Cell>
              <a href="/x">go</a>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByTestId("r-selected")).toHaveAttribute("data-selected", "true");
    expect(screen.getByTestId("r-link")).toHaveAdminClass("table-row-link");
  });

  it("row selection visual is driven by the checkbox check state (via :has in CSS, asserted here by data-checked)", async () => {
    const user = userEvent.setup();
    render(
      <Table>
        <Table.Body>
          <Table.Row data-testid="row">
            <Table.Cell>
              <Checkbox aria-label="select" />
            </Table.Cell>
            <Table.Cell>row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "select" });
    expect(checkbox).not.toHaveAttribute("data-checked");
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("data-checked");
  });
});
