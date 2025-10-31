
import React from 'react';
import { FactionFormData } from '../../types';
import FormField from '../common/FormField';

interface Props {
    formData: Partial<FactionFormData>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FactionDetailedForm: React.FC<Props> = ({ formData, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Faction Name" htmlFor="name"><input type="text" id="name" name="name" value={formData.name || ''} onChange={onChange} /></FormField>
        <FormField label="Primary Goal/Motto" htmlFor="goal"><input type="text" id="goal" name="goal" value={formData.goal || ''} onChange={onChange} /></FormField>
        <FormField label="Methods" htmlFor="methods" description="E.g., Militaristic, Secretive, Diplomatic"><input type="text" id="methods" name="methods" value={formData.methods || ''} onChange={onChange} /></FormField>
        <FormField label="Organization Style" htmlFor="style" description="E.g., Hierarchical, Decentralized"><input type="text" id="style" name="style" value={formData.style || ''} onChange={onChange} /></FormField>
        <FormField label="Public Perception" htmlFor="perception"><input type="text" id="perception" name="perception" value={formData.perception || ''} onChange={onChange} /></FormField>
        <FormField label="Base of Operations" htmlFor="baseOfOperations"><input type="text" id="baseOfOperations" name="baseOfOperations" value={formData.baseOfOperations || ''} onChange={onChange} /></FormField>

        <div className="md:col-span-2">
            <FormField label="Core Beliefs/Ideology" htmlFor="ideology" isTextArea>
                <textarea id="ideology" name="ideology" value={formData.ideology || ''} onChange={onChange} rows={3} />
            </FormField>
        </div>

        <FormField label="Key Strengths" htmlFor="strengths"><input type="text" id="strengths" name="strengths" value={formData.strengths || ''} onChange={onChange} /></FormField>
        <FormField label="Key Weaknesses" htmlFor="weaknesses"><input type="text" id="weaknesses" name="weaknesses" value={formData.weaknesses || ''} onChange={onChange} /></FormField>
        <FormField label="High-Valued DNA Traits" htmlFor="highTraits" description="E.g., Wealth, Secrecy, Magic"><input type="text" id="highTraits" name="highTraits" value={formData.highTraits || ''} onChange={onChange} /></FormField>
        <FormField label="Low-Valued DNA Traits" htmlFor="lowTraits" description="E.g., Morality, Numbers"><input type="text" id="lowTraits" name="lowTraits" value={formData.lowTraits || ''} onChange={onChange} /></FormField>

        <div className="md:col-span-2">
            <FormField label="Extra Context" htmlFor="extraContext" isTextArea>
                <textarea id="extraContext" name="extraContext" value={formData.extraContext || ''} onChange={onChange} rows={3} />
            </FormField>
        </div>
    </div>
);

export default FactionDetailedForm;
