import { Interface } from "readline"
import { createReadStream } from "fs"

//The library for types to be included in every build
//These will be useful data structure types and 
//other such structures and classes
//Currently excluded due to glitchiness


if (finished === false || finished === undefined)
{
    const Global = window || global

    //Vector 2 (position x and y + magnitude)
    class Vec2
    {
        /**
         * A vector 2, which is a vector in 2 dimensional space
         * and can be a coordinate or a direction
         * 
         * 
         * NOT READY FOR USE YET
         */
        x : number
        y : number
        magnitude : number
        constructor(x, y, magnitude?) {
            this.x = x
            this.y = y
            if (magnitude)
            {
                this.magnitude = magnitude
            }
        }

        //Makes all values on a 0 to 1 scale
        //by dividing by the magnitude
        Normalize()
        {
            if (this.magnitude === undefined)
            {
                console.error("MissingMagnitudeError: Magnitude is undefined, thus normalization is impossible for this vector.")
            } 
            this.x = this.x / this.magnitude
            this.y = this.y / this.magnitude
        }
    }

    class LinkedListNode
    {
        /*
        * A node for the Linked List data structure
        */
        next : LinkedListNode
        previous : LinkedListNode
        data : any
        constructor(next, previous, data?) {
            this.next = next
            this.previous = previous

            if (data != null)
            {
                this.data = data
            }
        }
    }

    (Global as any).LinkedListNode = LinkedListNode

    class LinkedList
    {
        /**
         * A class for the Linked List data structure
        */
        nodes : LinkedListNode[] = []
        constructor(initialState? : LinkedListNode[]) {
            //Need to check if it's an array else unshift won't work
            if (initialState != null)
            {
                this.nodes = initialState
            }
        }

        InsertAtHead(node : LinkedListNode)
        {
            this.nodes.unshift(node)

            this.Update()
        }

        DeleteAtHead()
        {
            this.nodes.shift()

            this.Update()
        }

        InsertAtEnd(node : LinkedListNode)
        {
            this.nodes.push(node)

            this.Update()
        }

        DeleteAtEnd()
        {
            this.nodes.pop()

            this.Update()
        }

        Search(data : any) : LinkedListNode
        {
            return this.nodes.find(data)
        }

        IsEmpty() : boolean
        {
            if (this.nodes.length === 0)
            {
                return true
            }
            else
            {
                return false
            }
        }

        //Updates next and previous values for nodes
        Update()
        {
            for (let i = 0; i < this.nodes.length; i++)
            {
                if (this.nodes[i-1] != undefined && this.nodes[i-1] != null)
                {
                    this.nodes[i].previous = this.nodes[i-1]
                }

                if (this.nodes[i+1] != undefined && this.nodes[i+1] != null)
                {
                    this.nodes[i].next = this.nodes[i+1]
                }
            }
        }
    }
    (Global as any).LinkedList = LinkedList 
}

var finished = true