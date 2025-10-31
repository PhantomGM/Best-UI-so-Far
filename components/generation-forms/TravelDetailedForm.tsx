
import React from 'react';
import { TravelFormData } from '../../types';
import FormField from '../common/FormField';

interface Props {
    formData: Partial<TravelFormData>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TravelDetailedForm: React.FC<Props> = ({ formData, onChange }) => (
    <div className="space-y-4">
        <FormField label="Name of the Region" htmlFor="regionName"><input type="text" id="regionName" name="regionName" value={formData.regionName || ''} onChange={onChange} /></FormField>
        <FormField label="Primary Terrain Type" htmlFor="terrain"><input type="text" id="terrain" name="terrain" value={formData.terrain || ''} onChange={onChange} /></FormField>
        <FormField label="Start Point" htmlFor="startPoint"><input type="text" id="startPoint" name="startPoint" value={formData.startPoint || ''} onChange={onChange} /></FormField>
        <FormField label="End Point" htmlFor="endPoint"><input type="text" id="endPoint" name="endPoint" value={formData.endPoint || ''} onChange={onChange} /></FormField>
        <FormField label="Purpose of the Journey" htmlFor="purpose" isTextArea>
            <textarea id="purpose" name="purpose" value={formData.purpose || ''} onChange={onChange} rows={2} />
        </FormField>
        <FormField label="Known Dangers" htmlFor="dangers" isTextArea>
            <textarea id="dangers" name="dangers" value={formData.dangers || ''} onChange={onChange} rows={2} />
        </FormField>
        <FormField label="Travel Preference" htmlFor="preference" description="E.g., 'Make it dangerous,' 'Focus on discovery,' 'Make it cursed'">
            <input type="text" id="preference" name="preference" value={formData.preference || ''} onChange={onChange} />
        </FormField>
        <FormField label="Extra Context" htmlFor="extraContext" isTextArea>
            <textarea id="extraContext" name="extraContext" value={formData.extraContext || ''} onChange={onChange} rows={3} />
        </FormField>
    </div>
);

export default TravelDetailedForm;
