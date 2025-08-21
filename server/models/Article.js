import mongoose from 'mongoose';


const articleSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, index: true },
        body: { type: String, required: true },
        tags: { type: [String], default: [], index: true },
        status: { type: String, enum: ['draft','published'], default: 'draft' },
    },
    { timestamps: true }
);


// helpful compound index for simple search sorts
articleSchema.index({ title: 'text', body: 'text', tags: 1 });


export default mongoose.model('Article', articleSchema);