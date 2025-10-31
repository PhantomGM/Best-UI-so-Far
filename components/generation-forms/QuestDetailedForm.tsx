
import React from 'react';
import { QuestFormData } from '../../types';
import FormField from '../common/FormField';

interface Props {
    formData: Partial<QuestFormData>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const QuestDetailedForm: React.FC<Props> = ({ formData, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Quest Title Idea" htmlFor="title"><input type="text" id="title" name="title" value={formData.title || ''} onChange={onChange} /></FormField>
        <FormField label="Primary Objective" htmlFor="objective" description="E.g., Rescue, Retrieve, Eliminate"><input type="text" id="objective" name="objective" value={formData.objective || ''} onChange={onChange} /></FormField>
        <FormField label="Key Obstacle" htmlFor="obstacle" description="E.g., A powerful monster, a political rival"><input type="text" id="obstacle" name="obstacle" value={formData.obstacle || ''} onChange={onChange} /></FormField>
        <FormField label="Quest Giver" htmlFor="giver"><input type="text" id="giver" name="giver" value={formData.giver || ''} onChange={onChange} /></FormField>
        <FormField label="Primary Location" htmlFor="location"><input type="text" id="location" name="location" value={formData.location || ''} onChange={onChange} /></FormField>
        <FormField label="Desired Tone" htmlFor="tone" description="E.g., Mystery, Horror, Epic Adventure"><input type="text" id="tone" name="tone" value={formData.tone || ''} onChange={onChange} /></FormField>
        <FormField label="Key Reward" htmlFor="reward" description="E.g., A unique magic item, a title and land"><input type="text" id="reward" name="reward" value={formData.reward || ''} onChange={onChange} /></FormField>
        <FormField label="Potential Twist" htmlFor="twist"><input type="text" id="twist" name="twist" value={formData.twist || ''} onChange={onChange} /></FormField>
        <FormField label="Primary Player Engagement" htmlFor="engagement" description="E.g., Combat, Exploration, Social"><input type="text" id="engagement" name="engagement" value={formData.engagement || ''} onChange={onChange} /></FormField>
        <FormField label="Difficulty/Complexity Preference" htmlFor="difficulty" description="E.g., 'High difficulty, low complexity'"><input type="text" id="difficulty" name="difficulty" value={formData.difficulty || ''} onChange={onChange} /></FormField>
        
        <div className="md:col-span-2">
            <FormField label="Extra Context" htmlFor="extraContext" isTextArea>
                <textarea id="extraContext" name="extraContext" value={formData.extraContext || ''} onChange={onChange} rows={3} />
            </FormField>
        </div>
    </div>
);

export default QuestDetailedForm;
