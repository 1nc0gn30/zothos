#!/usr/bin/env bash
# ==============================================================================
#  * ZOTH STUDIO STANDALONE APPIMAGE & PORTABLE BUNDLER *
#  Packages Zoth Studio into a standalone, self-contained AppImage binary
#  and portable runner with zero external dependencies.
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$ROOT_DIR/build/appimage/ZothStudio.AppDir"
OUTPUT_DIR="$ROOT_DIR/dist"

echo -e "\e[1;32m[+] Initializing Zoth Studio Standalone AppImage Build Pipeline...\e[0m"

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/usr/bin" \
         "$BUILD_DIR/usr/share/zoth-studio" \
         "$BUILD_DIR/usr/share/pixmaps" \
         "$BUILD_DIR/usr/share/applications" \
         "$OUTPUT_DIR"

# 1. Stage Assets & App Files
echo -e "\e[1;36m[i] Staging Zoth Studio assets and UI components...\e[0m"
cp -r "$ROOT_DIR/config/includes.chroot/opt/zoth-studio/"* "$BUILD_DIR/usr/share/zoth-studio/"

if [[ -f "$ROOT_DIR/config/includes.chroot/usr/share/pixmaps/zoth-studio.png" ]]; then
    cp "$ROOT_DIR/config/includes.chroot/usr/share/pixmaps/zoth-studio.png" "$BUILD_DIR/usr/share/pixmaps/"
    cp "$ROOT_DIR/config/includes.chroot/usr/share/pixmaps/zoth-studio.png" "$BUILD_DIR/zoth-studio.png"
    cp "$ROOT_DIR/config/includes.chroot/usr/share/pixmaps/zoth-studio.png" "$BUILD_DIR/.DirIcon"
fi

if [[ -f "$ROOT_DIR/config/includes.chroot/usr/share/applications/zoth-studio.desktop" ]]; then
    cp "$ROOT_DIR/config/includes.chroot/usr/share/applications/zoth-studio.desktop" "$BUILD_DIR/usr/share/applications/"
    cp "$ROOT_DIR/config/includes.chroot/usr/share/applications/zoth-studio.desktop" "$BUILD_DIR/zoth-studio.desktop"
fi

# 2. Stage Executable Runner
echo -e "\e[1;36m[i] Bundling standalone runtime and launcher...\e[0m"
cp "$ROOT_DIR/config/includes.chroot/usr/local/bin/zoth-studio" "$BUILD_DIR/usr/bin/zoth-studio"
chmod +x "$BUILD_DIR/usr/bin/zoth-studio"

# 3. Create AppRun Entrypoint
cat << 'EOF' > "$BUILD_DIR/AppRun"
#!/usr/bin/env bash
set -e
HERE="$(dirname "$(readlink -f "${0}")")"
export APPDIR="${HERE}"
export PATH="${HERE}/usr/bin:${PATH}"
export STUDIO_ROOT="${HERE}/usr/share/zoth-studio"
export PYTHONPATH="${HERE}/usr/lib/python3/dist-packages:${HERE}/usr/share/zoth-studio:${PYTHONPATH:-}"
export XDG_DATA_DIRS="${HERE}/usr/share:${XDG_DATA_DIRS:-/usr/local/share:/usr/share}"

# Ensure WebKit hardware compositing compatibility
export WEBKIT_DISABLE_COMPOSITING_MODE="${WEBKIT_DISABLE_COMPOSITING_MODE:-0}"

if [[ -x "${HERE}/usr/bin/zoth-studio" ]]; then
    exec python3 "${HERE}/usr/bin/zoth-studio" "$@"
elif [[ -f "${HERE}/usr/share/zoth-studio/launch.sh" ]]; then
    exec bash "${HERE}/usr/share/zoth-studio/launch.sh" "$@"
else
    exec python3 -m http.server 8088 --directory "${HERE}/usr/share/zoth-studio"
fi
EOF

chmod +x "$BUILD_DIR/AppRun"

# 4. Generate AppImage / Self-Extracting Executable
TARGET_APPIMAGE="$OUTPUT_DIR/ZothStudio-x86_64.AppImage"

if command -v appimagetool >/dev/null 2>&1; then
    echo -e "\e[1;32m[+] Packaging native AppImage via appimagetool...\e[0m"
    ARCH=x86_64 appimagetool "$BUILD_DIR" "$TARGET_APPIMAGE"
else
    echo -e "\e[1;33m[!] appimagetool not found on host. Assembling self-extracting portable AppImage bundle...\e[0m"
    
    # Create self-executing AppImage shell script
    PAYLOAD_TAR="$OUTPUT_DIR/.zoth_appdir_payload.tar.gz"
    (cd "$ROOT_DIR/build/appimage" && tar -czf "$PAYLOAD_TAR" ZothStudio.AppDir)
    
    cat << 'EOF' > "$TARGET_APPIMAGE"
#!/usr/bin/env bash
# Zoth Studio Pro — Standalone Self-Extracting Portable AppImage Runner
set -e
MOUNT_DIR=$(mktemp -d -t zothstudio-XXXXXX)
trap 'rm -rf "$MOUNT_DIR"' EXIT INT TERM

# Extract embedded payload to temp mount dir
PAYLOAD_LINE=$(grep --text --line-number '^__ZOTH_PAYLOAD_BELOW__' "$0" | cut -d: -f1)
tail -n +$((PAYLOAD_LINE + 1)) "$0" | tar -xz -C "$MOUNT_DIR" 2>/dev/null

export APPIMAGE="$(readlink -f "${0}")"
export ARGV0="$0"

exec "$MOUNT_DIR/ZothStudio.AppDir/AppRun" "$@"
exit 0
__ZOTH_PAYLOAD_BELOW__
EOF

    cat "$PAYLOAD_TAR" >> "$TARGET_APPIMAGE"
    rm -f "$PAYLOAD_TAR"
    chmod +x "$TARGET_APPIMAGE"
fi

# 5. Create Portable Tarball and Symlinks
echo -e "\e[1;36m[i] Generating portable tarball archive...\e[0m"
(cd "$ROOT_DIR/build/appimage" && tar -czf "$OUTPUT_DIR/ZothStudio-Portable.tar.gz" ZothStudio.AppDir)
ln -sf "ZothStudio-x86_64.AppImage" "$OUTPUT_DIR/ZothStudio.AppImage"

echo -e "\e[1;32m[✓] Standalone executable AppImage created: $TARGET_APPIMAGE\e[0m"
echo -e "\e[1;32m[✓] Portable archive created: $OUTPUT_DIR/ZothStudio-Portable.tar.gz\e[0m"
echo -e "\e[1;32m[✓] Zoth Studio AppImage packaging completed successfully!\e[0m"
