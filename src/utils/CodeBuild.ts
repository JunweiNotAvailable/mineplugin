import axios from 'axios';
import { config } from './Config';
import { buildspecTemplate } from './Code';

// update java & plugin.yml files before building (compile)
export const updateSpigotFiles = async (pluginName: string, code: string, yml: string) => {
  const builspec = buildspecTemplate.replaceAll('<project>', pluginName);
  // buildspec.yml
  await axios.post(`${config.api.s3}/access-file`, {
    bucket: 'mc-picker-bucket',
    path: `/buildspec.yml`,
    content: builspec,
  });
  // manifest
  await axios.post(`${config.api.s3}/access-file`, {
    bucket: 'mc-picker-bucket',
    path: `/manifest.txt`,
    content: `Main-Class: ${pluginName}`,
  });
  // java code
  await axios.post(`${config.api.s3}/access-file`, {
    bucket: 'mc-picker-bucket',
    path: `/${pluginName}.java`,
    content: code,
  });
  // plugin.yml
  await axios.post(`${config.api.s3}/access-file`, {
    bucket: 'plugin-cake-bucket',
    path: `/plugin.yml`,
    content: yml,
  });
}

// Execute AWS CodeBuild with buildspec file
export const build = async () => {
  const codeBuildName = '';
  const buildspecS3Path = `/buildspec.yml`;
  const buildId = (await axios.get(`${config.api.codeBuild}/execute-code-build?codebuild=${codeBuildName}&buildspec=${buildspecS3Path}`)).data.buildId;
  return buildId;
}

// track the build process
export const trackBuild = async (buildId: string) => {
  const status = (await axios.get(`${config.api.codeBuild}/track-build?buildId=${buildId}`)).data.status;
  return status;
}

// download file from s3
export const downloadFile = async (path: string, targetFileName: string) => {
  const data = (await axios.get(`${config.api.s3}/access-file?bucket=plugin-cake-bucket&path=${path}`)).data;
  const { content, contentType } = data;
  saveBufferAsFile(content, targetFileName, contentType);

  return true;
}

// save the file to local
export const saveBufferAsFile = (buffer: ArrayBuffer, filePath: string, contentType: string): void => {
  // Convert the ArrayBuffer to a Blob
  const blob = new Blob([new Uint8Array(buffer)], { type: contentType });
  // Create a Blob URL
  const blobUrl = window.URL.createObjectURL(blob);
  // Create a download link and trigger the download
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filePath;
  // Programmatically click the link to trigger the download
  a.click();

  // Revoke the Blob URL to release resources
  window.URL.revokeObjectURL(blobUrl);
}
