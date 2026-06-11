import pkg from "../../../package.json";

/** Current released version. Root `package.json` is the canonical release pointer that
 * release-it bumps and the bumper plugin mirrors into both published packages. */
export const version: string = pkg.version;
