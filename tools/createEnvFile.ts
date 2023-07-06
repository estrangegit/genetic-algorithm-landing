import * as shell from "shelljs";

const ENV_FILE_LOCATION = 'src/public/js/env.js';

shell.touch(ENV_FILE_LOCATION);
shell.ShellString("const env = {").to(ENV_FILE_LOCATION);
shell.ShellString(`SERVER_PORT: '${process.env.SERVER_PORT || '8080'}', `).toEnd(ENV_FILE_LOCATION);
shell.ShellString(`SERVER_HOST_NAME: '${process.env.SERVER_HOST_NAME || 'localhost'}'`).toEnd(ENV_FILE_LOCATION);
shell.ShellString("}").toEnd(ENV_FILE_LOCATION);
