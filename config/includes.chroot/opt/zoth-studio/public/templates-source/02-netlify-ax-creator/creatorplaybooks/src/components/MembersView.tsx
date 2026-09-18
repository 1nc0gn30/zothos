import { useState, useEffect } from 'react';
import { Users, Edit3, Save, ExternalLink, ThumbsUp, ThumbsDown, Plus, X, Loader2, CheckCircle, Globe, Github, Sparkles } from 'lucide-react';
import { useAuth } from '../lib/auth';
import type { MemberProfile } from '../lib/member-types';
import { voteCreator, fetchVotes, submitCreator } from '../lib/member-api';
import { CREATORS } from '../lib/creators';

export function MembersView() {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<MemberProfile | null>(null);
  const [votes, setVotes] = useState<Record<string, { up: number; down: number; score: number }>>({});
  const [myVotes, setMyVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitOk, setSubmitOk] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm(profile);
      setMyVotes(profile.votes || {});
    }
    fetchVotes().then(setVotes).catch(() => {});
  }, [profile]);

  if (!user || !form) {
    return (
      <div className="page">
        <section className="hero-section compact center">
          <div className="hero-badge"><Users size={14} /> Members</div>
          <h1>Loading member area...</h1>
        </section>
      </div>
    );
  }

  const initials = form.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  const save = async () => {
    if (!form) return;
    await updateProfile({
      name: form.name,
      handle: form.handle,
      bio: form.bio,
      building: form.building,
      website: form.website,
      xHandle: form.xHandle,
      github: form.github,
      admiredCreators: form.admiredCreators,
      likedPlaybooks: form.likedPlaybooks,
    });
    setEdit(false);
  };

  const toggleVote = async (creatorId: string, direction: 'up' | 'down') => {
    const current = myVotes[creatorId];
    const next = current === direction ? null : direction;
    setMyVotes((v) => ({ ...v, [creatorId]: next }));
    try {
      const res = await voteCreator(creatorId, next);
      setVotes((v) => ({ ...v, [creatorId]: res.summary }));
      await refreshProfile();
    } catch (e) {
      console.error('vote failed', e);
      setMyVotes((v) => ({ ...v, [creatorId]: current }));
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const handle = fd.get('handle') as string;
    const name = fd.get('name') as string;
    const category = fd.get('category') as string;
    const reason = fd.get('reason') as string;
    if (!handle || !name || !category || !reason) return;
    setSubmitting(true);
    try {
      await submitCreator(handle, name, category, reason);
      setSubmitOk(true);
      setTimeout(() => { setSubmitOk(false); setSubmitOpen(false); }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  const admired = form.admiredCreators || [];
  const liked = form.likedPlaybooks || [];

  return (
    <div className="page members-page">
      <div className="members-header">
        <div className="members-header-badge">
          <span className="pulse-dot" />
          Member Hub
        </div>
        <h2 className="page-title">Your member profile</h2>
        <p className="page-subtitle">Manage your identity, vote on creators, and contribute to the directory.</p>
      </div>

      <section className="member-hero">
        <div className="member-banner" />
        <div className="member-avatar" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
          {form.avatar ? <img src={form.avatar} alt={form.name} /> : initials}
        </div>
        <div className="member-title">
          <h1>{form.name || 'Builder'}</h1>
          <span className="member-handle">@{form.handle}</span>
          <span className="member-role">
            <Sparkles size={10} style={{ display: 'inline' }} /> {form.role}
          </span>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setEdit((x) => !x)}>
          {edit ? <><X size={14} /> Cancel</> : <><Edit3 size={14} /> Edit profile</>}
        </button>
      </section>

      {edit ? (
        <section className="member-edit">
          <div className="field-group">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field-group">
            <label>Handle</label>
            <input value={form.handle} onChange={(e) => setForm({ ...form, handle: e.target.value.replace(/[^a-z0-9_]/gi, '') })} />
          </div>
          <div className="field-group">
            <label>Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
          </div>
          <div className="field-group">
            <label>What are you building?</label>
            <input value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} placeholder="e.g. an AI agent for indie hackers" />
          </div>
          <div className="field-row">
            <div className="field-group">
              <label>Website</label>
              <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
            </div>
            <div className="field-group">
              <label>X handle</label>
              <input value={form.xHandle} onChange={(e) => setForm({ ...form, xHandle: e.target.value })} placeholder="@you" />
            </div>
          </div>
          <div className="field-actions">
            <button className="btn btn-hot" onClick={save}>
              <Save size={14} /> Save profile
            </button>
          </div>
        </section>
      ) : (
        <section className="member-about">
          <p>{form.bio}</p>
          {form.building && (
            <div className="member-building">
              <strong>Building:</strong> {form.building}
            </div>
          )}
          <div className="member-links">
            {form.website && <a href={form.website} target="_blank" rel="noreferrer"><Globe size={14} /> Website</a>}
            {form.xHandle && <a href={`https://x.com/${form.xHandle.replace('@', '')}`} target="_blank" rel="noreferrer"><ExternalLink size={14} /> X / Twitter</a>}
            {form.github && <a href={form.github} target="_blank" rel="noreferrer"><Github size={14} /> GitHub</a>}
          </div>
        </section>
      )}

      <section className="member-votes">
        <div className="section-header">
          <h2>Respectful votes</h2>
          <p className="section-subtitle">Upvote creators whose playbooks help you. Downvote only if their profile is inaccurate. No BS.</p>
        </div>
        <div className="vote-list">
          {CREATORS.map((c) => {
            const summary = votes[c.id] || { up: 0, down: 0, score: 0 };
            const mine = myVotes[c.id];
            return (
              <div key={c.id} className="vote-row">
                <div className="vote-info">
                  <strong>{c.name}</strong>
                  <span className="vote-handle">{c.handle}</span>
                </div>
                <div className="vote-bar-wrap">
                  <span className="vote-score">{summary.score} pts</span>
                  {summary.up + summary.down > 0 ? (
                    <div className="vote-ratio-bar" title={`${Math.round((summary.up / (summary.up + summary.down)) * 100)}% positive feedback`}>
                      <div className="fill" style={{ width: `${(summary.up / (summary.up + summary.down)) * 100}%` }} />
                    </div>
                  ) : (
                    <div className="vote-ratio-bar empty" title="No feedback yet">
                      <div className="fill" style={{ width: '0%' }} />
                    </div>
                  )}
                </div>
                <div className="vote-actions">
                  <button className={mine === 'up' ? 'active' : ''} onClick={() => toggleVote(c.id, 'up')} title="Helpful playbook">
                    <ThumbsUp size={14} /> <span>{summary.up}</span>
                  </button>
                  <button className={mine === 'down' ? 'active down' : 'down'} onClick={() => toggleVote(c.id, 'down')} title="Inaccurate profile">
                    <ThumbsDown size={14} /> <span>{summary.down}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="member-submit">
        <div className="section-header">
          <h2>Submit a creator</h2>
          <p className="section-subtitle">Suggest someone new. Submissions go through a quick review by Maya / Neal to keep the directory clean.</p>
        </div>
        {!submitOpen ? (
          <button className="btn btn-secondary" onClick={() => setSubmitOpen(true)}>
            <Plus size={16} /> Suggest creator
          </button>
        ) : (
          <form className="submit-form" onSubmit={submit}>
            {submitOk ? (
              <div className="submit-ok">
                <CheckCircle size={18} /> Submitted for review. Thanks!
              </div>
            ) : (
              <>
                <div className="field-row">
                  <div className="field-group">
                    <label>X handle</label>
                    <input name="handle" placeholder="@creator" required />
                  </div>
                  <div className="field-group">
                    <label>Name</label>
                    <input name="name" placeholder="Creator name" required />
                  </div>
                  <div className="field-group">
                    <label>Category</label>
                    <select name="category" required>
                      <option value="">Pick one...</option>
                      <option value="indie-hackers">Indie hackers</option>
                      <option value="netlify-shippers">Netlify shippers</option>
                      <option value="big-players">Big players</option>
                    </select>
                  </div>
                </div>
                <div className="field-group">
                  <label>Why should they be listed?</label>
                  <textarea name="reason" rows={3} placeholder="Share their playbook, product, or influence..." required />
                </div>
                <div className="field-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setSubmitOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-hot" disabled={submitting}>
                    {submitting ? <Loader2 size={14} className="spin" /> : <><Plus size={14} /> Submit for review</>}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </section>

      {(admired.length > 0 || liked.length > 0) && (
        <section className="member-faves">
          {admired.length > 0 && (
            <div className="member-fave-block">
              <h3>Vibed creators</h3>
              <div className="member-fave-chips">
                {admired.map((id) => {
                  const c = CREATORS.find((x) => x.id === id);
                  return c ? <span key={id} className="tag-chip">{c.name}</span> : null;
                })}
              </div>
            </div>
          )}
          {liked.length > 0 && (
            <div className="member-fave-block">
              <h3>Liked playbooks</h3>
              <div className="member-fave-chips">
                {liked.map((id) => {
                  const c = CREATORS.find((x) => x.id === id);
                  return c ? <span key={id} className="tag-chip">{c.name}</span> : null;
                })}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}