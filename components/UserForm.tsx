import React from 'react';

export interface UserFormProps {
    isEditing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    title: string;
    formData: {
        email: string;
        password: string;
        confirmPassword: string;
        role: string;
    };
    onFormChange: (field: string, value: string) => void;
}

const UserForm: React.FC<UserFormProps> = ({
    isEditing,
    onSubmit,
    onCancel,
    title,
    formData,
    onFormChange,
}) => {
    return (
        <div>
            <h3>{title}</h3>
            <form onSubmit={onSubmit}>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => onFormChange('email', e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => onFormChange('password', e.target.value)}
                    placeholder="Password"
                    required={!isEditing}
                />
                <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => onFormChange('confirmPassword', e.target.value)}
                    placeholder="Confirm Password"
                    required={!isEditing}
                />
                <select
                    value={formData.role}
                    onChange={(e) => onFormChange('role', e.target.value)}
                >
                    <option value="" disabled>Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="root">Root</option>
                </select>
                <button type="button" onClick={onCancel}>Cancel</button>
                <button type="submit">{isEditing ? "Update" : "Create"}</button>
            </form>
        </div>
    );
};

export default UserForm;