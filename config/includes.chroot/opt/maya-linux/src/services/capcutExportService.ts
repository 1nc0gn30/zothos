import { ProjectState } from '../types/project';
import { CANVAS_ASPECTS } from '../models/devices';

export interface CapCutDraftExportResult {
  contentJson: string;
  metaJson: string;
  projectName: string;
}

export function generateCapCutDraft(project: ProjectState): CapCutDraftExportResult {
  const aspect = CANVAS_ASPECTS[project.canvasAspect];
  const width = aspect.renderWidth;
  const height = aspect.renderHeight;
  const durationSec = Math.max(1, project.videoDuration || 10);
  const durationMicro = Math.round(durationSec * 1000000);
  const projectName = `Maya-${project.displayName?.replace(/\.[^/.]+$/, "") || "Project"}`;
  const draftId = `maya_draft_${Date.now()}`;

  // 1. Materials
  const videoMaterialId = `video_mat_${Date.now()}`;
  const videoMaterials = project.videoURL ? [
    {
      category_id: "",
      category_name: "local",
      check_flag: 63487,
      duration: durationMicro,
      extra_type: "video",
      height: project.videoNaturalHeight || height,
      id: videoMaterialId,
      import_time: Date.now(),
      import_time_ms: Date.now(),
      item_source: 1,
      material_name: project.displayName || "Recording.mp4",
      material_url: "",
      path: project.displayName || "Recording.mp4",
      type: "video",
      video_algorithm: { algorithms: [], def_rely_material_list: [] },
      width: project.videoNaturalWidth || width,
    }
  ] : [];

  // Speeds
  const speeds = (project.speedSegments || []).map((seg, idx) => ({
    curve_speed: null,
    id: `speed_mat_${idx}_${seg.id}`,
    mode: 0,
    speed: seg.rate,
    type: "speed",
  }));

  // Texts / Subtitles / Overlays
  const texts: any[] = [];
  const textTracks: any[] = [];

  // Map Text Overlays
  (project.overlays || []).forEach((overlay, idx) => {
    const textId = `text_mat_overlay_${idx}`;
    const startMicro = Math.round(overlay.startTime * 1000000);
    const durMicro = Math.round(overlay.duration * 1000000);

    texts.push({
      id: textId,
      content: JSON.stringify({
        text: overlay.text,
        styles: [
          {
            fill: { alpha: 1, content: { solid: { color: [1, 1, 1] } } },
            font: { id: "", path: "" },
            size: overlay.fontSize || 24,
          }
        ]
      }),
      type: "text",
    });

    textTracks.push({
      id: `text_seg_${idx}`,
      material_id: textId,
      render_index: 10 + idx,
      source_timerange: { duration: durMicro, start: 0 },
      target_timerange: { duration: durMicro, start: startMicro },
      clip: {
        transform: {
          x: (overlay.position.x - 0.5) * 2,
          y: -(overlay.position.y - 0.5) * 2,
        }
      }
    });
  });

  // Map Subtitles
  (project.subtitles || []).forEach((sub, idx) => {
    const subTextId = `text_mat_sub_${idx}`;
    const startMicro = Math.round(sub.startTime * 1000000);
    const durMicro = Math.round(sub.duration * 1000000);

    texts.push({
      id: subTextId,
      content: JSON.stringify({
        text: sub.uppercase ? sub.text.toUpperCase() : sub.text,
        styles: [
          {
            fill: { 
              alpha: 1, 
              content: { 
                solid: { color: sub.style === 'hormozi' ? [1, 0.9, 0.1] : [1, 1, 1] } 
              } 
            },
            font: { id: "", path: "" },
            size: sub.fontSize || 32,
            bold: sub.style === 'hormozi' || sub.style === 'minimal',
          }
        ]
      }),
      type: "text",
    });

    textTracks.push({
      id: `sub_seg_${idx}`,
      material_id: subTextId,
      render_index: 20 + idx,
      source_timerange: { duration: durMicro, start: 0 },
      target_timerange: { duration: durMicro, start: startMicro },
      clip: {
        transform: {
          x: 0,
          y: -( (sub.positionY ?? 0.82) - 0.5) * 2,
        }
      }
    });
  });

  // Map Stickers & Emojis
  (project.stickers || []).forEach((sticker, idx) => {
    const stickerTextId = `text_mat_sticker_${idx}`;
    const startMicro = Math.round(sticker.startTime * 1000000);
    const durMicro = Math.round(sticker.duration * 1000000);

    texts.push({
      id: stickerTextId,
      content: JSON.stringify({
        text: sticker.emojiOrIcon,
        styles: [
          {
            fill: { alpha: 1, content: { solid: { color: [1, 1, 1] } } },
            font: { id: "", path: "" },
            size: sticker.size || 64,
          }
        ]
      }),
      type: "text",
    });

    textTracks.push({
      id: `sticker_seg_${idx}`,
      material_id: stickerTextId,
      render_index: 30 + idx,
      source_timerange: { duration: durMicro, start: 0 },
      target_timerange: { duration: durMicro, start: startMicro },
      clip: {
        transform: {
          x: (sticker.position.x - 0.5) * 2,
          y: -(sticker.position.y - 0.5) * 2,
        }
      }
    });
  });

  // Map Watermark
  if (project.watermark?.enabled && project.watermark.text) {
    const watermarkId = `text_mat_watermark`;
    const durMicro = durationMicro;
    texts.push({
      id: watermarkId,
      content: JSON.stringify({
        text: project.watermark.text,
        styles: [
          {
            fill: { alpha: project.watermark.opacity ?? 0.75, content: { solid: { color: [1, 1, 1] } } },
            font: { id: "", path: "" },
            size: 20 * (project.watermark.scale || 1.0),
            bold: true,
          }
        ]
      }),
      type: "text",
    });

    const isTop = project.watermark.position.startsWith('top');
    const isLeft = project.watermark.position.endsWith('left');

    textTracks.push({
      id: `watermark_seg`,
      material_id: watermarkId,
      render_index: 50,
      source_timerange: { duration: durMicro, start: 0 },
      target_timerange: { duration: durMicro, start: 0 },
      clip: {
        transform: {
          x: isLeft ? -0.8 : 0.8,
          y: isTop ? 0.85 : -0.85,
        }
      }
    });
  }

  // Audio Materials
  const audios: any[] = [];
  const audioTracks: any[] = [];
  (project.audioTracks || []).forEach((audio, idx) => {
    const audioId = `audio_mat_${idx}`;
    const startMicro = Math.round(audio.startTime * 1000000);
    const durMicro = Math.round(audio.duration * 1000000);

    audios.push({
      id: audioId,
      material_name: audio.name || `Audio_${idx + 1}.mp3`,
      path: audio.name || "",
      type: "audio",
      duration: durMicro,
    });

    audioTracks.push({
      id: `audio_seg_${idx}`,
      material_id: audioId,
      render_index: idx,
      source_timerange: { duration: durMicro, start: 0 },
      target_timerange: { duration: durMicro, start: startMicro },
      volume: audio.volume ?? 0.8,
    });
  });

  // Main Video Track
  const mainVideoTrack = {
    id: "main_video_track",
    type: "video",
    segments: project.videoURL ? [
      {
        id: "video_seg_0",
        material_id: videoMaterialId,
        render_index: 0,
        source_timerange: { duration: durationMicro, start: Math.round(project.trimStartTime * 1000000) },
        target_timerange: { duration: durationMicro, start: 0 },
        clip: {
          scale: { x: project.scale, y: project.scale },
          transform: { x: project.offset.width * 2, y: -project.offset.height * 2 },
        }
      }
    ] : []
  };

  const tracks: any[] = [mainVideoTrack];

  if (audioTracks.length > 0) {
    tracks.push({
      id: "main_audio_track",
      type: "audio",
      segments: audioTracks,
    });
  }

  if (textTracks.length > 0) {
    tracks.push({
      id: "main_text_track",
      type: "text",
      segments: textTracks,
    });
  }

  // Final draft_content.json
  const draftContent = {
    canvas_config: {
      height,
      ratio: aspect.ratio === 1 ? "1:1" : aspect.ratio > 1 ? "16:9" : "9:16",
      width,
    },
    color_space: 0,
    config: {
      adjust_max_index: 1,
      attachment_info: [],
      combination_max_index: 1,
      export_range: null,
      extract_audio_last_index: 1,
      lyrics_recognition_id: "",
      lyrics_sync: true,
      lyrics_taskinfo: [],
      maintrack_adsorb: true,
      material_save_mode: 0,
      original_sound_last_index: 1,
      record_from_mic: false,
      sticker_max_index: 1,
      subtitle_keywords_config: null,
      subtitle_recognition_id: "",
      subtitle_sync: true,
      subtitle_taskinfo: [],
      system_font_list: [],
      video_mute: project.isMuted,
      zoom_info_params: null
    },
    cover: null,
    create_time: Date.now(),
    duration: durationMicro,
    extra_info: null,
    fps: 60,
    free_render_index_mode_on: false,
    group_container: null,
    id: draftId,
    keyframe_graph_list: [],
    keyframes: {
      adjusts: [],
      audios: [],
      effects: [],
      filters: [],
      handwrites: [],
      stickers: [],
      texts: [],
      videos: []
    },
    last_modified_platform: {
      app_id: 3704,
      app_source: "maya_video_editor",
      app_version: "1.2.0",
      device_id: "linux_desktop",
      hard_disk_id: "",
      mac_address: "",
      os: "linux",
      os_version: "6.x"
    },
    materials: {
      ai_translates: [],
      audio_balances: [],
      audio_effects: [],
      audio_fades: [],
      audio_track_indexes: [],
      audios,
      beats: [],
      canvases: [],
      chromas: [],
      color_curves: [],
      digital_humans: [],
      drafts: [],
      effects: [],
      flowers: [],
      green_screens: [],
      handwrites: [],
      hsl: [],
      images: [],
      log_color_wheels: [],
      manual_deformations: [],
      masks: [],
      material_animations: [],
      material_colors: [],
      multi_language_refs: [],
      placeholders: [],
      plugin_effects: [],
      primary_color_wheels: [],
      realtime_denoises: [],
      shapes: [],
      smart_crops: [],
      smart_relights: [],
      sound_channel_mappings: [],
      speeds,
      stickers: [],
      tail_leaders: [],
      text_templates: [],
      texts,
      time_marks: [],
      transitions: [],
      video_effects: [],
      video_trackings: [],
      videos: videoMaterials,
      vocal_beautifys: [],
      vocal_separations: []
    },
    mutable_config: null,
    name: projectName,
    new_version: "105.0.0",
    platform: {
      app_id: 3704,
      app_source: "maya_video_editor",
      app_version: "1.2.0",
      os: "linux"
    },
    relationships: [],
    render_index_mode: "default",
    retouch_cover: null,
    source: "default",
    static_cover_image_info: null,
    tracks,
    update_time: Date.now(),
    version: 3000
  };

  const draftMeta = {
    draft_cloud_capcut_id: "",
    draft_cloud_last_action_download: false,
    draft_cloud_materials: [],
    draft_cloud_purchase_info: [],
    draft_cloud_template_id: "",
    draft_cloud_tutorial_info: "",
    draft_cloud_videocut_purchase_info: [],
    draft_cover: "",
    draft_deeplink_url: "",
    draft_enterprise_info: {
      draft_enterprise_extra: "",
      draft_enterprise_id: "",
      draft_enterprise_name: "",
      enterprise_material: []
    },
    draft_fold_path: "",
    draft_id: draftId,
    draft_is_ai_packaging: false,
    draft_is_ai_shorts: false,
    draft_is_ai_summary: false,
    draft_is_article_video: false,
    draft_is_auto_cut: false,
    draft_is_clean: false,
    draft_is_from_deeplink: false,
    draft_is_invisible: false,
    draft_is_recreated: false,
    draft_is_unfinish: false,
    draft_name: projectName,
    draft_new_version: "",
    draft_open_app_source: "",
    draft_open_scene: "",
    draft_remind_group_id: "",
    draft_root_path: "",
    draft_timeline_materials_size: 0,
    draft_type: "",
    tm_draft_cloud_completed: 0,
    tm_draft_cloud_modified: 0,
    tm_draft_create: Math.floor(Date.now() / 1000),
    tm_draft_modified: Math.floor(Date.now() / 1000),
    tm_draft_removed: 0,
    tm_duration: durationMicro
  };

  return {
    contentJson: JSON.stringify(draftContent, null, 2),
    metaJson: JSON.stringify(draftMeta, null, 2),
    projectName,
  };
}
