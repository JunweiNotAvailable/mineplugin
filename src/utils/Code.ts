export const defaultCode = `import org.bukkit.plugin.java.JavaPlugin;

public class MyPlugin extends JavaPlugin {

  @Override
  public void onEnable() {
    System.out.println("MyPlugin enabled!");
  }

}
`;


export const pluginYml =
  `name: Plugin
version: 1.0
main: Plugin
description: Description.
author: Author
api-version: '1.20'`;


export const buildspecTemplate =
  `version: 0.2

phases:
  build:
    commands:
      # download files from s3 to codebuild
      - aws s3 cp s3://mc-picker-bucket/<project>.java ./<project>.java
      - aws s3 cp s3://mc-picker-bucket/spigot-api-1.20.1.jar ./spigot-api.jar
      - aws s3 cp s3://mc-picker-bucket/plugin.yml ./plugin.yml
      - aws s3 cp s3://mc-picker-bucket/manifest.txt ./manifest.txt
      
      # build
      - javac -d classes -cp spigot-api.jar <project>.java
      - cp plugin.yml classes/
      - jar cfm <project>.jar manifest.txt -C classes .
      - rm -f manifest.txt
      
      # copy the jar file to s3
      - aws s3 cp <project>.jar s3://mc-picker-bucket/<project>.jar`;


// Extract plugin name from code string
export const extractPluginName = (code: string): string | null => {
  const match = code.match(/public\s+class\s+(\w+)\s+extends\s+JavaPlugin\s*\{/s);
  return match ? match[1] : null;
}

// get commands from code
export const getCommandsFromCode = (code: string) => {
  const regex = /getCommand\("([^"]+)"\)/g;
  const matches = [];
  let match = regex.exec(code);
  while (match) {
    matches.push(match[1]);
    match = regex.exec(code);
  }

  return matches;
}

// insert command to yml file from code string
export const insertCommand = (yml: string, code: string) => {
  const commands = getCommandsFromCode(code);
  if (commands.length > 0) {
    yml += `
commands:
  `;
    for (const command of commands) {
      yml += `${command}:
    description: 'Skip for now'
  `;
    }
  }
  return yml;
}