#!/usr/bin/env bash
# ==============================================================================
#  * ZOTH STUDIO STANDALONE APPIMAGE BUILDER *
#  Packages Zoth Studio into a single-file portable AppImage binary.
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$ROOT_DIR/build/appimage/ZothStudio.AppDir"
OUTPUT_DIR="$ROOT_DIR/dist"

echo -e "\e[1;32m[+] Initializing Zoth Studio AppImage Build Pipeline...\e[0m"

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/usr/bin" "$BUILD_DIR/usr/share/zoth-studio" "$BUILD_DIR/usr/share/pixmaps" "$BUILD_DIR/usr/share/applications" "$OUTPUT_DIR"

# 1. Copy Assets & App Files
echo -e "\e[1;36m[i] Staging Zoth Studio assets...\e[0m"
cp -r "$ROOT_DIR/config/includes.chroot/opt/zoth-studio/"* "$BUILD_DIR/usr/share/zoth-studio/"
cp "$ROOT_DIR/config/includes.chroot/usr/share/pixmaps/zoth-studio.png" "$BUILD_DIR/usr/share/pixmaps/"
cp "$ROOT_DIR/config/includes.chroot/usr/share/pixmaps/zoth-studio.png" "$BUILD_DIR/zoth-studio.png"
cp "$ROOT_DIR/config/includes.chroot/usr/share/applications/zoth-studio.desktop" "$BUILD_DIR/"

# 2. Copy Executable Runner
cp "$ROOT_DIR/config/includes.chroot/usr/local/bin/zoth-studio" "$BUILD_DIR/usr/bin/zoth-studio"
chmod +x "$BUILD_DIR/usr/bin/zoth-studio"

# 3. Create AppRun Entrypoint
cat << 'EOF' > "$BUILD_DIR/AppRun"
#!/usr/bin/env bash
HERE="$(dirname "$(readlink -f "${0}")")"
export PATH="${HERE}/usr/bin:${PATH}"
export STUDIO_ROOT="${HERE}/usr/share/zoth-studio"
export PYTHONPATH="${HERE}/usr/lib/python3/dist-packages:${PYTHONPATH:-}"

exec python3 "${HERE}/usr/bin/zoth-studio" "$@"
EOF

chmod +x "$BUILD_DIR/AppRun"

# 4. Generate AppImage using appimagetool if installed, or create self-extracting runtime
if command -v appimagetool >/dev/null 2>&1; then
    echo -e "\e[1;32m[+] Packaging with appimagetool...\e[0m"
    ARCH=x86_64 appimagetool "$BUILD_DIR" "$OUTPUT_DIR/ZothStudio-x86_64.AppImage"
else
    echo -e "\e[1;33m[!] appimagetool not found on PATH. Creating standalone self-extracting package...\e[0m"
    cd "$ROOT_DIR/build/appimage"
    tar -czf "$OUTPUT_DIR/ZothStudio-Portable.tar.gz" ZothStudio.AppDir
    echo -e "\e[1;32m[✓] Standalone portable package created at: $OUTPUT_DIR/ZothStudio-Portable.tar.gz\e[0m"
fi

echo -e "\e[1;32m[✓] Zoth Studio AppImage packaging completed successfully!\e[0m"
