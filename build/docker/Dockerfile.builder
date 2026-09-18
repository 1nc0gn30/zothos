# ==============================================================================
#  ZOTHOS REPRODUCIBLE ISO BUILDER CONTAINER
# ==============================================================================
FROM debian:trixie-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    live-build \
    debootstrap \
    xorriso \
    squashfs-tools \
    isolinux \
    syslinux-common \
    grub-pc-bin \
    grub-efi-amd64-bin \
    mtools \
    dosfstools \
    python3 \
    python3-pil \
    git \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

CMD ["bash", "build/build-iso.sh"]
