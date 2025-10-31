
import React from 'react';
import { SettlementFormData } from '../../types';
import FormField from '../common/FormField';

interface Props {
    formData: Partial<SettlementFormData>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SettlementDetailedForm: React.FC<Props> = ({ formData, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Location Name" htmlFor="name"><input type="text" id="name" name="name" value={formData.name || ''} onChange={onChange} /></FormField>
        <FormField label="Location Type" htmlFor="type" description="E.g., City, Forest, Ruin, Dungeon"><input type="text" id="type" name="type" value={formData.type || ''} onChange={onChange} /></FormField>
        <FormField label="Primary Inhabitants" htmlFor="inhabitants"><input type="text" id="inhabitants" name="inhabitants" value={formData.inhabitants || ''} onChange={onChange} /></FormField>
        <FormField label="Key Landmark or Feature" htmlFor="landmark"><input type="text" id="landmark" name="landmark" value={formData.landmark || ''} onChange={onChange} /></FormField>
        <FormField label="General Mood/Atmosphere" htmlFor="atmosphere"><input type="text" id="atmosphere" name="atmosphere" value={formData.atmosphere || ''} onChange={onChange} /></FormField>
        <FormField label="A Current Conflict or Problem" htmlFor="conflict"><input type="text" id="conflict" name="conflict" value={formData.conflict || ''} onChange={onChange} /></FormField>
        <FormField label="A Hidden Secret or Treasure" htmlFor="secret"><input type="text" id="secret" name="secret" value={formData.secret || ''} onChange={onChange} /></FormField>
        <FormField label="Primary DNA Focus" htmlFor="dnaFocus" description="E.g., 'High Magic,' 'Low Tech,' 'High Conflict'"><input type="text" id="dnaFocus" name="dnaFocus" value={formData.dnaFocus || ''} onChange={onChange} /></FormField>
        
        <div className="md:col-span-2">
            <FormField label="Extra Context" htmlFor="extraContext" isTextArea>
                <textarea id="extraContext" name="extraContext" value={formData.extraContext || ''} onChange={onChange} rows={3} />
            </FormField>
        </div>
    </div>
);

export default SettlementDetailedForm;
