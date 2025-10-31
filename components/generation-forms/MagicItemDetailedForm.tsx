
import React from 'react';
import { MagicItemFormData } from '../../types';
import FormField from '../common/FormField';

interface Props {
    formData: Partial<MagicItemFormData>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const MagicItemDetailedForm: React.FC<Props> = ({ formData, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Item Name Idea" htmlFor="name"><input type="text" id="name" name="name" value={formData.name || ''} onChange={onChange} /></FormField>
        <FormField label="Item Type" htmlFor="type" description="E.g., Weapon, Armor, Wondrous Item"><input type="text" id="type" name="type" value={formData.type || ''} onChange={onChange} /></FormField>
        
        <div className="md:col-span-2">
            <FormField label="Primary Magical Effect" htmlFor="effect" isTextArea>
                <textarea id="effect" name="effect" value={formData.effect || ''} onChange={onChange} rows={3}/>
            </FormField>
        </div>

        <div className="md:col-span-2">
            <FormField label="Visual Appearance" htmlFor="appearance" isTextArea>
                <textarea id="appearance" name="appearance" value={formData.appearance || ''} onChange={onChange} rows={3}/>
            </FormField>
        </div>

        <FormField label="Item's Origin/History" htmlFor="origin"><input type="text" id="origin" name="origin" value={formData.origin || ''} onChange={onChange} /></FormField>
        <FormField label="A Minor Quirk or Drawback" htmlFor="quirk"><input type="text" id="quirk" name="quirk" value={formData.quirk || ''} onChange={onChange} /></FormField>
        
        <div className="md:col-span-2">
            <FormField label="Primary DNA Focus" htmlFor="dnaFocus" description="E.g., 'Focus on a high Arcane score,' 'Make it more Cursed'">
                <input type="text" id="dnaFocus" name="dnaFocus" value={formData.dnaFocus || ''} onChange={onChange} />
            </FormField>
        </div>

        <div className="md:col-span-2">
            <FormField label="Extra Context" htmlFor="extraContext" isTextArea>
                <textarea id="extraContext" name="extraContext" value={formData.extraContext || ''} onChange={onChange} rows={3}/>
            </FormField>
        </div>
    </div>
);

export default MagicItemDetailedForm;
