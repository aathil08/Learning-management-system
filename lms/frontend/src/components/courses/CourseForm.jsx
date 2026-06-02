import { useState } from 'react';
import Modal from '../common/Modal';
import { Input, Textarea, Select, FormGroup } from '../common/Input';
import Btn from '../common/Btn';

const CourseForm = ({ course, onClose, onSave, loading }) => {
  const [form, setForm] = useState({
    title:       course?.title       || '',
    description: course?.description || '',
    category:    course?.category    || 'Web Development',
    level:       course?.level       || 'Beginner',
    price:       course?.price       || 0,
    isPublished: course?.isPublished ?? false,
    thumbnail:   course?.thumbnail   || '',
  });
  const [file, setFile] = useState(null);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    if (!form.title || !form.description) { alert('Title and description required.'); return; }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('thumbnail', file);
    onSave(fd);
  };

  return (
    <Modal onClose={onClose} title={course ? '✏️ Edit Course' : '✨ Create New Course'} maxWidth={560}>
      <div style={{ display: 'grid', gap: 16 }}>
        <Input label="Course Title *" value={form.title} onChange={set('title')} placeholder="e.g. Complete React Masterclass" />
        <Textarea label="Description *" value={form.description} onChange={set('description')} placeholder="What will students learn?" rows={3} />
        <FormGroup cols={2}>
          <Select label="Category" value={form.category} onChange={set('category')}>
            {['Web Development','Mobile','Data Science','Design','DevOps','Other'].map(c => <option key={c}>{c}</option>)}
          </Select>
          <Select label="Level" value={form.level} onChange={set('level')}>
            {['Beginner','Intermediate','Advanced'].map(l => <option key={l}>{l}</option>)}
          </Select>
        </FormGroup>
        <FormGroup cols={2}>
          <Input label="Price (₹)" type="number" value={form.price} onChange={set('price')} min={0} />
          <div>
            <label style={{ color: 'var(--text3)', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Status</label>
            <select value={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.value === 'true' }))}
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px', color: 'var(--text)', fontSize: 14, width: '100%', fontFamily: 'inherit' }}>
              <option value="false">Draft</option>
              <option value="true">Published</option>
            </select>
          </div>
        </FormGroup>
        <div>
          <label style={{ color: 'var(--text3)', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Thumbnail Image</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])}
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text2)', fontSize: 13, width: '100%', fontFamily: 'inherit' }} />
          {!file && <Input label="" style={{ marginTop: 8 }} value={form.thumbnail} onChange={set('thumbnail')} placeholder="Or paste image URL" />}
        </div>
      </div>
      <Btn onClick={handleSave} loading={loading} size="lg" style={{ width: '100%', marginTop: 22 }}>
        {course ? 'Save Changes' : 'Create Course'}
      </Btn>
    </Modal>
  );
};

export default CourseForm;
