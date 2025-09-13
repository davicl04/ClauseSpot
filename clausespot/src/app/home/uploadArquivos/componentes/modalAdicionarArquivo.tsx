import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react";
import { FormAdicionarArquivo } from "./formAdicionarArquivo";

interface Props {
    listaArquivos: any[]
    setListaArquivos: React.Dispatch<React.SetStateAction<any[]>>
}

export function ModalAdicionarArquivo({ listaArquivos, setListaArquivos }: Props) {

    const [pendent, setPendent] = useState(false);
    const [open, setOpen] = useState(false);

    function closeDialog() {
        setOpen(false)
    }

    const changePendentStatus = (boolean: boolean) => {
        if (boolean) {
        setPendent(true)
        }
        else {
        setPendent(false)
        }
    }

    return (
        <div className="flex justfy-end">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-500 text-white font-semibold py-1 px-3 rounded-lg mt-2 mb-2 mr-2  hover:bg-sky-600">
                        Adicionar Arquivo
                    </Button>
                </DialogTrigger>

                <DialogContent className="w-3/4 rounded-md">
                    <DialogHeader>
                        <DialogTitle>Faça o upload de um arquivo</DialogTitle>
                        <DialogDescription>
                            Preencha os campos abaixo:
                        </DialogDescription>
                    </DialogHeader>

                    <FormAdicionarArquivo 
                        setPendent={changePendentStatus} 
                        closeDialog={closeDialog} 
                        listaArquivos={listaArquivos}
                        setListaArquivos={setListaArquivos}
                    >
                        <DialogClose asChild>
                            <Button disabled={pendent} className="w-[20%] xs:w-[40%] bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white">Cancelar</Button>
                        </DialogClose>
                    </FormAdicionarArquivo>
                </DialogContent>
            </Dialog>
        </div>
    )
}