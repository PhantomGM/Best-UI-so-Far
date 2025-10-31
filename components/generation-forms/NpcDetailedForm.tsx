
import React from 'react';
import { NpcFormData } from '../../types';
import FormField from '../common/FormField';

interface Props {
    formData: Partial<NpcFormData>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const NpcDetailedForm: React.FC<Props> = ({ formData, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Name" htmlFor="name"><input type="text" id="name" name="name" value={formData.name || ''} onChange={onChange} /></FormField>
        <FormField label="Role/Occupation" htmlFor="role"><input type="text" id="role" name="role" value={formData.role || ''} onChange={onChange} /></FormField>
        <FormField label="Archetype" htmlFor="archetype"><input type="text" id="archetype" name="archetype" value={formData.archetype || ''} onChange={onChange} /></FormField>
        <FormField label="Race/Species" htmlFor="race"><input type="text" id="race" name="race" value={formData.race || ''} onChange={onChange} /></FormField>
        <FormField label="Age" htmlFor="age"><input type="text" id="age" name="age" value={formData.age || ''} onChange={onChange} /></FormField>
        <FormField label="Pronouns" htmlFor="pronouns"><input type="text" id="pronouns" name="pronouns" value={formData.pronouns || ''} onChange={onChange} /></FormField>
        <FormField label="Signature Behavior/Quirk" htmlFor="quirk"><input type="text" id="quirk" name="quirk" value={formData.quirk || ''} onChange={onChange} /></FormField>
        <FormField label="Preferred Alignment" htmlFor="alignment" description="E.g., Lawful Good, Chaotic Neutral"><input type="text" id="alignment" name="alignment" value={formData.alignment || ''} onChange={onChange} /></FormField>
        
        <div className="md:col-span-2">
            <FormField label="Appearance Notes" htmlFor="appearanceNotes" isTextArea>
                <textarea id="appearanceNotes" name="appearanceNotes" value={formData.appearanceNotes || ''} onChange={onChange} rows={3} />
            </FormField>
        </div>
        <div className="md:col-span-2">
            <FormField label="Backstory Notes" htmlFor="backstoryNotes" isTextArea>
                <textarea id="backstoryNotes" name="backstoryNotes" value={formData.backstoryNotes || ''} onChange={onChange} rows={3} />
            </FormField>
        </div>
        
        <FormField label="Beliefs/Desires/Intentions" htmlFor="bdi"><input type="text" id="bdi" name="bdi" value={formData.bdi || ''} onChange={onChange} /></FormField>
        <FormField label="Secret(s)" htmlFor="secrets"><input type="text" id="secrets" name="secrets" value={formData.secrets || ''} onChange={onChange} /></FormField>
        <FormField label="Notable Possessions" htmlFor="possessions"><input type="text" id="possessions" name="possessions" value={formData.possessions || ''} onChange={onChange} /></FormField>
        <FormField label="High-Valued Traits" htmlFor="highTraits" description="E.g., Brave, Honest"><input type="text" id="highTraits" name="highTraits" value={formData.highTraits || ''} onChange={onChange} /></FormField>
        <FormField label="Low-Valued Traits" htmlFor="lowTraits" description="E.g., Cowardly, Deceitful"><input type="text" id="lowTraits" name="lowTraits" value={formData.lowTraits || ''} onChange={onChange} /></FormField>
        
        <div className="md:col-span-2">
            <FormField label="Extra Context" htmlFor="extraContext" isTextArea>
                <textarea id="extraContext" name="extraContext" value={formData.extraContext || ''} onChange={onChange} rows={3} />
            </FormField>
        </div>
    </div>
);

export default NpcDetailedForm;
