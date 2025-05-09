import { createEngineeringCommand } from '@/modules/c-hub/application/engineering-instance/engineering-instance-commands';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// 建立工程 mutation hook
export function useCreateEngineeringInstanceMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEngineeringCommand,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['engineerings'] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });
}
