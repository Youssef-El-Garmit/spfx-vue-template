/*
    Build and ship webpart
    @date 2022-04-13
    This script looks for a built collection of files to reference within the webpart, which will render it.
    See the webpart/src/webparts/Vue3ViteWebPart.ts file for further comments.
*/
const fs = require("fs");

const path = require("path");

function findFileCaseInsensitive(dir, filename) {
    const files = fs.readdirSync(dir);
    const match = files.find(f => f.toLowerCase() === filename.toLowerCase());
    return match ? path.join(dir, match) : null;
}

const PACKAGE_SOLUTION = "webpart/config/package-solution.json",
    WEBPART_BASE = "webpart/src/webparts",
    ASSETS_BASE = "webpart/src/webparts/assets/appcode",
    WEBPART_SUFFIX = "WebPart.ts",
    INDEX_JS = 'import { renderVue } from "../assets/appcode/index',
    INDEX_CSS = 'import "../assets/appcode/index',
    VENDOR_JS = 'import "../assets/appcode/vendor',
    SUFFIX = "\";\n",
    RENDER_PREFIX = "export function renderVue(appID) {\n",
    RENDER_SUFFIX = "}\n";

const logStatus = (message) => {
        if (message) console.log("\n" + message);
    },
    logError = (errorData) => {
        console.error("\nERROR:\n");
        console.error(errorData);
    },
    getPackageVersion = (basePath) => {
        try {
            let package = JSON.parse(fs.readFileSync(basePath + "package.json", "utf-8"));
            return package.version;
        } catch (e) {
            logError(e);
            return ""
        }
    },
    updatePackageSolutionVersion = (basePath, newVersion) => {
        try {
            let packageSolution = JSON.parse(fs.readFileSync(basePath + PACKAGE_SOLUTION, "utf-8"));
            packageSolution.solution.version = newVersion;
            fs.writeFileSync(basePath + PACKAGE_SOLUTION, JSON.stringify(packageSolution, null, "\t"));
            logStatus("package-solution.json version updated to " + newVersion);
        } catch (e) {
            logError(e);
        }
    },
    getWebpartName = (basePath) => {
        let folders = [],
            webpartName = "";
        try {
            fs.readdirSync(basePath + WEBPART_BASE).forEach((file) => {
                let itemPath = basePath + WEBPART_BASE + `/` + file;
                let isDir = fs.statSync(itemPath).isDirectory();
                if (isDir && file != "assets") webpartName = file;
            });
        } catch (e) {
            logError(e);
        }
        return webpartName;
    },
    getAssetFiles = (basePath) => {
        let assetFiles = [];
        try {
            fs.readdirSync(basePath + ASSETS_BASE).forEach((file) => {
                let itemPath = basePath + ASSETS_BASE + `/` + file;
                let isDir = fs.statSync(itemPath).isDirectory();
                if (!isDir) assetFiles.push(file);
            });
        } catch (e) {
            logError(e);
        }
        return assetFiles;
    },
    replaceLine = (textContents, linePrefix, newText, eolText) => {
        if (textContents && linePrefix && newText) {
            let p = textContents.indexOf(linePrefix),
                eol = textContents.indexOf("\n", p);
            if (p >= 0 && eol > p) {
                return textContents.substring(0, p) + linePrefix + newText + eolText + textContents.substring(eol + 1);
            } else return textContents;
        } else return textContents;
    },
    updateRefsInWebpart = (basePath, webpartName, assetFiles) => {
        if (basePath && webpartName && assetFiles) {
            try {
                const webpartDir = path.join(basePath, WEBPART_BASE, webpartName);
                const targetFileName = `${webpartName}${WEBPART_SUFFIX}`;
                
                // Find actual file regardless of casing
                const webpartFilePath = findFileCaseInsensitive(webpartDir, targetFileName);
    
                if (!webpartFilePath) {
                    throw new Error(`Webpart file not found: ${targetFileName} in ${webpartDir}`);
                }
    
                let script = fs.readFileSync(webpartFilePath, "utf-8");
    
                const indexJsAsset = assetFiles.find(f => /^(?:.*\/)?index(?:[-.][\w\d]+)?\.js$/i.test(f));
                const indexCssAsset = assetFiles.find(f => /^(?:.*\/)?index(?:[-.][\w\d]+)?\.js$/i.test(f));
                const vendorJsAsset = assetFiles.find(f => /^(?:.*\/)?vendor(?:[-.][\w\d]+)?\.js$/i.test(f));
    
                if (script && indexJsAsset && indexCssAsset) {
                    script = replaceLine(script, INDEX_JS, indexJsAsset.replace("index", ""), SUFFIX);
                    script = replaceLine(script, INDEX_CSS, indexCssAsset.replace("index", ""), SUFFIX);
                    if (vendorJsAsset) {
                        script = replaceLine(script, VENDOR_JS, vendorJsAsset.replace("vendor", ""), SUFFIX);
                    }
                    console.log("herreee");
                }
    
                console.log(webpartFilePath);
                fs.writeFileSync(webpartFilePath, script);
                logStatus("Webpart script references new assets.");
            } catch (e) {
                logError(e);
            }
        }
    },
    addRenderFn = (assetsBase, assetFiles, _prefix, _suffix) => {
        if (!assetsBase) return;
        try {
          const indexJsAsset = assetFiles.find(f => /^(?:.*\/)?index(?:[-.][\w\d]+)?\.js$/i.test(f));
          if (!indexJsAsset) {
            logError("Can't find index.js asset.");
            return;
          }
      
          const filePath = assetsBase + "/" + indexJsAsset;
          let script = fs.readFileSync(filePath, "utf-8");
      
          // Avoid re-adding
          if (script.includes("renderVue") && script.includes("__vue3_spfx__")) {
            logStatus("Render function already appended.");
            return;
          }
      
          // We don't try to move code; we only APPEND a wrapper that uses the existing 'xa' Vue app.
          const appendix = `
      
      /* ===== SPFx wrapper appended by build script =====
         Exposes a CommonJS export and a browser global without using ESM 'export'
         Expected: the bundle defines 'xa' = createApp(...).
      */
      (function(factory){
        if (typeof exports === 'object' && typeof module !== 'undefined') {
          factory(exports);
        } else {
          window.__vue3_spfx__ = window.__vue3_spfx__ || {};
          factory(window.__vue3_spfx__);
        }
      })(function(exports){
        // 'xa' must be in scope in the built bundle (created by Vite/Vue)
        if (typeof xa === "undefined") {
          console && console.warn && console.warn("[vue3-spfx] Vue app instance 'xa' not found in bundle.");
          return;
        }
        exports.renderVue = function renderVue(appID){ xa.mount(appID); };
      });
      /* ===== end wrapper ===== */
      `;
      
          fs.writeFileSync(filePath, script + appendix);
          logStatus("App script updated with render function (CommonJS + global).");
        } catch (e) {
          logError(e);
        }
      }
      ,
    run = () => {
        let basePath = process.cwd() + "/",
            version = getPackageVersion(basePath);
        if (version) {
            let webpartName = getWebpartName(basePath);
            logStatus("Build and ship webpart: " + webpartName);
            updatePackageSolutionVersion(basePath, version+".0");
            let assetFiles = getAssetFiles(basePath);
            logStatus("Bundle assets: " + assetFiles.join(", "));
            updateRefsInWebpart(basePath, webpartName, assetFiles);
            addRenderFn(ASSETS_BASE + "/", assetFiles, RENDER_PREFIX, RENDER_SUFFIX);
            console.log("\n\n");
        }
    }

run();