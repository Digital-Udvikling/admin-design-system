import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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
        <Table.Foot>
          <Table.Row>
            <Table.Cell>Total</Table.Cell>
            <Table.Cell numeric>1</Table.Cell>
          </Table.Row>
        </Table.Foot>
      </Table>,
    );
    const table = screen.getByRole("table");
    expect(table).toHaveAdminClass("table");
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute("scope", "col");
    expect(screen.getByRole("cell", { name: "ada@example.com" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Total" })).toBeInTheDocument();
  });

  it("Table.Foot renders a tfoot and passes className through", () => {
    render(
      <Table>
        <Table.Foot className="totals" data-testid="foot">
          <Table.Row>
            <Table.Cell>Total</Table.Cell>
          </Table.Row>
        </Table.Foot>
      </Table>,
    );
    const foot = screen.getByTestId("foot");
    expect(foot.tagName).toBe("TFOOT");
    expect(foot).toHaveClass("totals");
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

  it("maps density to the padding modifier and keeps relaxed working", () => {
    const { rerender } = render(
      <Table density="compact" data-testid="t">
        <Table.Body>
          <Table.Row>
            <Table.Cell>x</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByTestId("t")).toHaveAdminClass("table-compact");

    rerender(
      <Table relaxed data-testid="t">
        <Table.Body>
          <Table.Row>
            <Table.Cell>x</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByTestId("t")).toHaveAdminClass("table-relaxed");
  });

  it("pins the first column with pinCol", () => {
    render(
      <Table pinCol data-testid="t">
        <Table.Body>
          <Table.Row>
            <Table.Cell>x</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByTestId("t")).toHaveAdminClass("table-pin-col");
  });

  it("Table.Empty renders a spanning message row", () => {
    render(
      <Table>
        <Table.Body>
          <Table.Empty colSpan={3}>No results</Table.Empty>
        </Table.Body>
      </Table>,
    );
    const cell = screen.getByRole("cell", { name: "No results" });
    expect(cell).toHaveAdminClass("table-empty");
    expect(cell).toHaveAttribute("colspan", "3");
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

  it("Table.HeaderCell with scope=row renders a body-styled row header", () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.HeaderCell scope="row">#1001</Table.HeaderCell>
            <Table.Cell>Ada</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const header = screen.getByRole("rowheader", { name: "#1001" });
    expect(header).toHaveAttribute("scope", "row");
    expect(header).toHaveAdminClass("table-cell");
    expect(header).not.toHaveAdminClass("table-header-cell");
  });

  it("Table.HeaderCell sort renders a table-sort button and sets aria-sort only when sorted", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell sort="ascending" onSort={onSort}>
              Name
            </Table.HeaderCell>
            <Table.HeaderCell sort="none">Created</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
      </Table>,
    );
    const name = screen.getByRole("columnheader", { name: "Name" });
    expect(name).toHaveAttribute("aria-sort", "ascending");
    expect(screen.getByRole("columnheader", { name: "Created" })).not.toHaveAttribute("aria-sort");
    expect(screen.getByRole("columnheader", { name: "Email" }).querySelector("button")).toBeNull();

    const button = screen.getByRole("button", { name: "Name" });
    expect(button).toHaveAdminClass("table-sort");
    expect(button).toHaveAttribute("type", "button");
    await user.click(button);
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it("Table.Cell actions and Table.Scroll emit their classes", () => {
    render(
      <Table.Scroll data-testid="scroll">
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell actions data-testid="actions">
                <button type="button">Approve</button>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Table.Scroll>,
    );
    expect(screen.getByTestId("scroll")).toHaveAdminClass("table-scroll");
    expect(screen.getByTestId("actions")).toHaveAdminClass("table-cell", "table-cell-actions");
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
